from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import subprocess
import tempfile
import base64
import re
from pathlib import Path
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DSP Learning App API")

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
app.mount("/static", StaticFiles(directory=BASE_DIR), name="static")

CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(__file__), 'chroma_db')

CODE_TIMEOUT_SECONDS = 10

# ---------------------------------------------------------------------------
# Week-to-topic curriculum map
# ---------------------------------------------------------------------------
CURRICULUM = {
    1:  {"topic": "Introduction to DSP",                "slides": "dsp01", "hw": "01", "lab": "01"},
    2:  {"topic": "LTI Systems & Convolution",          "slides": "dsp02", "hw": "02", "lab": "02"},
    3:  {"topic": "Fourier Series & Fourier Transform",  "slides": "dsp03", "hw": "03", "lab": "03"},
    4:  {"topic": "DTFT & Frequency Response",           "slides": "dsp04", "hw": "04", "lab": "04"},
    5:  {"topic": "Z-Transform",                         "slides": "dsp05", "hw": "05", "lab": "05"},
    6:  {"topic": "Sampling & Reconstruction",           "slides": "dsp06", "hw": "06", "lab": "06"},
    7:  {"topic": "DFT & Spectral Analysis",             "slides": "dsp07", "hw": "07", "lab": "07"},
    8:  {"topic": "FFT & Efficient Computation",         "slides": "dsp08", "hw": "08", "lab": "08"},
    9:  {"topic": "IIR Filter Design",                   "slides": "dsp09", "hw": "09", "lab": "09"},
    10: {"topic": "FIR Filter Design",                   "slides": "dsp10", "hw": "10", "lab": "10"},
    11: {"topic": "Filter Structures & Implementation",  "slides": "dsp11", "hw": "11", "lab": "11"},
    12: {"topic": "Advanced Topics & Applications",      "slides": "dsp12", "hw": "12", "lab": "12"},
    13: {"topic": "Course Review & Exam Preparation",    "slides": "dsp13", "hw": None,  "lab": "13"},
}


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]

class CodeRequest(BaseModel):
    code: str

class CodeResponse(BaseModel):
    output: str
    error: str
    figures: list[str]  # base64-encoded PNG images

class TeachRequest(BaseModel):
    question: str | None = None  # optional follow-up focus

class QuizRequest(BaseModel):
    week: int
    topic: str | None = None
    answer: str | None = None  # if provided, check the answer


# ---------------------------------------------------------------------------
# Source-path helper
# ---------------------------------------------------------------------------
def _make_source_relative(source_path: str) -> str:
    """Convert an absolute source path to a relative /static/ URL."""
    try:
        rel = os.path.relpath(source_path, BASE_DIR)
        return f"/static/{rel}"
    except ValueError:
        return source_path


def _extract_sources(context_docs: list) -> list[dict]:
    """De-duplicate and build source dicts from retrieval context."""
    sources: list[dict] = []
    seen: set[str] = set()
    for doc in context_docs:
        raw = doc.metadata.get("source", "Unknown")
        key = f"{raw}:{doc.metadata.get('page', 0)}"
        if key in seen:
            continue
        seen.add(key)
        sources.append({
            "source": _make_source_relative(raw),
            "page": doc.metadata.get("page", 0),
            "type": doc.metadata.get("source_type", "Unknown"),
        })
    return sources


# ---------------------------------------------------------------------------
# System prompt — the pedagogical core
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """You are **Professor DSP**, an expert Digital Signal Processing tutor.
Your mission is not to *tell* the student facts but to make them **understand** — to spark
the "aha!" moment where math, intuition, and code click together.

═══════════════════════════════════════════════════════════════════
  CONTEXT (lecture slides, homework problems, lab code)
═══════════════════════════════════════════════════════════════════
{context}

═══════════════════════════════════════════════════════════════════
  PEDAGOGICAL PRINCIPLES  — follow these in EVERY response
═══════════════════════════════════════════════════════════════════

1. **Scaffolding**: Always connect the current concept to what the student learned in
   previous weeks. Start by recalling a prior idea.

2. **Concrete Before Abstract**: Before showing any formula, present a *concrete*
   example — a real signal, a plot, or a physical scenario.

3. **Active Recall**: End EVERY explanation with a thought-provoking question that
   forces the student to retrieve and apply what they just learned.

4. **The 'Aha!' Moment Pattern**: Structure explanations as:
   a. Present a **puzzle or surprising fact**
   b. Build curiosity
   c. **Resolve it** through the concept, with math and code.

5. **Homework as Guided Discovery**: When the student asks about homework, NEVER
   give the final answer. Instead:
   - Identify which lecture concept unlocks the solution
   - Point to the specific slide or theorem
   - Show which line(s) of lab code implement the relevant operation
   - Give a *first step* hint.

═══════════════════════════════════════════════════════════════════
  RESPONSE FORMAT — use this structure for EVERY substantive reply
═══════════════════════════════════════════════════════════════════

## 🎯 Concept
One clear sentence: what are we learning and why it matters.

## 💡 Intuition
A concrete example, analogy, or surprising fact (the "puzzle").
Use a real-world signal scenario whenever possible.

## 📐 The Math
Derive or present the key formula(s). Use LaTeX:
- Inline math with dollar signs
- Display math (centered, on its own line) with double dollar signs

Show each step. Explain what each variable means.

## 🐍 Python Code
A runnable, well-commented code block that demonstrates the concept:
```python
import numpy as np
import matplotlib.pyplot as plt
# ... working example
```
The code MUST:
- Import all needed libraries
- Be self-contained and runnable
- Include comments explaining the connection to the math
- Generate a plot when appropriate

## 🔗 Homework Connection
Link this concept to the relevant homework problem and lab exercise.
If the student is asking about a homework problem, give hints — NOT the answer.
Point to specific slides and lab functions.

## 🤔 Think About It
End with a question that tests understanding. Make it specific, not generic.

═══════════════════════════════════════════════════════════════════
  FORMATTING RULES
═══════════════════════════════════════════════════════════════════
- Always use **Markdown** with proper headings (##), bold, bullet points
- Always use **LaTeX** for math: inline $...$ and display $$...$$
- Always use fenced code blocks with language tag: ```python
- When showing transforms or frequency domain concepts, show BOTH
  the time-domain and frequency-domain view
- Use tables to compare related concepts (e.g., DTFT vs DFT vs Z-transform)
- Keep explanations progressive: simple → intermediate → complete
"""


# ---------------------------------------------------------------------------
# Lazy initialization of shared components
# ---------------------------------------------------------------------------
_qa_chain = None
_retriever = None
_llm = None


def _init_components():
    """Initialize embeddings, vector store, retriever, and LLM once."""
    global _retriever, _llm

    if _retriever is not None:
        return

    if not os.environ.get("GOOGLE_API_KEY"):
        raise RuntimeError("GOOGLE_API_KEY is not set.")

    if not os.path.exists(CHROMA_PERSIST_DIR):
        raise RuntimeError("Vector database not found. Please run ingest.py first.")

    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")
    db = Chroma(persist_directory=CHROMA_PERSIST_DIR, embedding_function=embeddings)
    _retriever = db.as_retriever(search_kwargs={"k": 6})
    _llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)


def get_qa_chain():
    """Build the main conversational retrieval chain (lazy)."""
    global _qa_chain
    if _qa_chain is not None:
        return _qa_chain

    _init_components()

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "{input}"),
    ])

    question_answer_chain = create_stuff_documents_chain(_llm, prompt)
    _qa_chain = create_retrieval_chain(_retriever, question_answer_chain)
    return _qa_chain


# ---------------------------------------------------------------------------
# /api/chat  — main conversational endpoint
# ---------------------------------------------------------------------------
@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        chain = get_qa_chain()
        response = chain.invoke({"input": request.message})

        sources = _extract_sources(response.get("context", []))
        return ChatResponse(answer=response["answer"], sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# /api/teach/{week}  — structured weekly lesson
# ---------------------------------------------------------------------------
@app.post("/api/teach/{week}", response_model=ChatResponse)
async def teach_endpoint(week: int, body: TeachRequest | None = None):
    if week not in CURRICULUM:
        raise HTTPException(status_code=400, detail=f"Week must be 1–13. Got {week}.")

    try:
        _init_components()

        info = CURRICULUM[week]
        topic = info["topic"]

        # Build a focused query that retrieves materials for this specific week
        week_str = f"{week:02d}"
        filter_query = (
            f"Week {week} {topic}. "
            f"Slides: {info['slides']}. "
            f"Lab: lab{week_str}. "
        )
        if info["hw"]:
            filter_query += f"Homework: dsp_homework{week_str}. "

        # Retrieve relevant docs
        docs = _retriever.invoke(filter_query)

        # Build previous-weeks recap for scaffolding
        prior_topics = [
            f"Week {w}: {CURRICULUM[w]['topic']}"
            for w in range(1, week)
        ]
        prior_str = "\n".join(prior_topics) if prior_topics else "This is the first week."

        focus = ""
        if body and body.question:
            focus = f"\n\nThe student specifically wants to focus on: {body.question}"

        teach_prompt_text = (
            f"Create a comprehensive, structured lesson for **Week {week}: {topic}**.\n\n"
            f"Previous weeks covered:\n{prior_str}\n\n"
            f"Use the scaffolding principle to connect this week's material to what came before.\n"
            f"Follow the full response format (Concept → Intuition → Math → Python Code → "
            f"Homework Connection → Think About It).\n"
            f"Be thorough — this is the student's primary learning resource for the week."
            f"{focus}"
        )

        teach_system = SYSTEM_PROMPT.replace("{context}", "\n\n".join(
            doc.page_content for doc in docs
        ))

        prompt = ChatPromptTemplate.from_messages([
            ("system", teach_system),
            ("human", "{input}"),
        ])

        chain = create_stuff_documents_chain(_llm, prompt)
        # We already injected context into system prompt, invoke directly
        result = chain.invoke({"input": teach_prompt_text, "context": docs})

        sources = _extract_sources(docs)
        return ChatResponse(answer=result, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# /api/quiz  — practice problems with hints and answer checking
# ---------------------------------------------------------------------------
@app.post("/api/quiz", response_model=ChatResponse)
async def quiz_endpoint(request: QuizRequest):
    if request.week not in CURRICULUM:
        raise HTTPException(status_code=400, detail=f"Week must be 1–13. Got {request.week}.")

    try:
        _init_components()

        info = CURRICULUM[request.week]
        topic = request.topic or info["topic"]

        # Retrieve relevant context
        query = f"Week {request.week} {topic} practice problems examples"
        docs = _retriever.invoke(query)

        if request.answer:
            # Student submitted an answer — evaluate it
            quiz_input = (
                f"The student was given a practice problem about **{topic}** "
                f"(Week {request.week}).\n\n"
                f"Their answer is:\n```\n{request.answer}\n```\n\n"
                f"Evaluate their answer:\n"
                f"1. Is it correct? If partially correct, what part is right?\n"
                f"2. If wrong, DON'T give the answer — give a specific hint about "
                f"where their reasoning went wrong.\n"
                f"3. Point them to the relevant concept from the slides.\n"
                f"4. End with an encouraging follow-up question.\n\n"
                f"Use the 'Guided Discovery' principle."
            )
        else:
            # Generate a new practice problem
            quiz_input = (
                f"Generate a practice problem for **Week {request.week}: {topic}**.\n\n"
                f"The problem should:\n"
                f"1. Start with the 'Aha! Moment' pattern — present a surprising scenario\n"
                f"2. Be solvable using concepts from the lectures and labs for this week\n"
                f"3. Require both mathematical reasoning AND Python implementation\n"
                f"4. Include multiple hints (hidden behind '**Hint 1:**', '**Hint 2:**', etc.)\n"
                f"5. Be at homework difficulty level\n\n"
                f"Format:\n"
                f"## 🧩 Practice Problem\n"
                f"[The scenario/question]\n\n"
                f"## 📊 Given\n"
                f"[Any given values, signals, or parameters]\n\n"
                f"## ❓ Tasks\n"
                f"[Numbered list of what the student must find/compute/plot]\n\n"
                f"## 💡 Hints\n"
                f"[Progressive hints, each revealing a bit more]\n\n"
                f"Do NOT include the solution."
            )

        quiz_system = SYSTEM_PROMPT.replace("{context}", "\n\n".join(
            doc.page_content for doc in docs
        ))

        prompt = ChatPromptTemplate.from_messages([
            ("system", quiz_system),
            ("human", "{input}"),
        ])

        chain = create_stuff_documents_chain(_llm, prompt)
        result = chain.invoke({"input": quiz_input, "context": docs})

        sources = _extract_sources(docs)
        return ChatResponse(answer=result, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# /api/run-code  — safe subprocess execution with matplotlib capture
# ---------------------------------------------------------------------------
_FIGURE_INJECT = """
# --- injected by DSP tutor to capture matplotlib figures ---
import matplotlib as _mpl
_mpl.use('Agg')  # non-interactive backend
import matplotlib.pyplot as _plt
import base64 as _b64, io as _io, json as _json, sys as _sys

_original_show = _plt.show
_captured_figures = []

def _capture_show(*args, **kwargs):
    for _fig_num in _plt.get_fignums():
        _fig = _plt.figure(_fig_num)
        _buf = _io.BytesIO()
        _fig.savefig(_buf, format='png', dpi=120, bbox_inches='tight',
                     facecolor='#1e2127', edgecolor='none')
        _buf.seek(0)
        _captured_figures.append(_b64.b64encode(_buf.read()).decode('utf-8'))
        _buf.close()
    _plt.close('all')

_plt.show = _capture_show
# --- end injection ---

"""

_FIGURE_EXTRACT = """

# --- injected: emit captured figures ---
# Capture any un-shown figures (plt.show() was never called)
for _fig_num in _plt.get_fignums():
    _fig = _plt.figure(_fig_num)
    _buf = _io.BytesIO()
    _fig.savefig(_buf, format='png', dpi=120, bbox_inches='tight',
                 facecolor='#1e2127', edgecolor='none')
    _buf.seek(0)
    _captured_figures.append(_b64.b64encode(_buf.read()).decode('utf-8'))
    _buf.close()
_plt.close('all')
if _captured_figures:
    print("__FIGURES_JSON__" + _json.dumps(_captured_figures))
# --- end extraction ---
"""


@app.post("/api/run-code", response_model=CodeResponse)
async def run_code_endpoint(request: CodeRequest):
    """Execute user code in an isolated subprocess with timeout and figure capture."""

    # Prepend figure capture injection, append figure extraction
    full_code = _FIGURE_INJECT + request.code + _FIGURE_EXTRACT

    # Write to a temporary file
    tmp_dir = os.path.join(os.path.dirname(__file__), ".tmp_code")
    os.makedirs(tmp_dir, exist_ok=True)

    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".py", dir=tmp_dir, delete=False
    ) as f:
        f.write(full_code)
        tmp_path = f.name

    try:
        # Determine the Python interpreter from our venv
        venv_python = os.path.join(os.path.dirname(__file__), "venv", "bin", "python")
        python_exe = venv_python if os.path.exists(venv_python) else "python3"

        result = subprocess.run(
            [python_exe, tmp_path],
            capture_output=True,
            text=True,
            timeout=CODE_TIMEOUT_SECONDS,
            cwd=tmp_dir,
            env={
                **os.environ,
                "MPLBACKEND": "Agg",
            },
        )

        stdout = result.stdout
        stderr = result.stderr

        # Extract base64 figures from stdout
        figures: list[str] = []
        clean_lines: list[str] = []
        for line in stdout.splitlines():
            if line.startswith("__FIGURES_JSON__"):
                try:
                    import json
                    figs = json.loads(line[len("__FIGURES_JSON__"):])
                    figures.extend(figs)
                except (json.JSONDecodeError, TypeError):
                    clean_lines.append(line)
            else:
                clean_lines.append(line)

        return CodeResponse(
            output="\n".join(clean_lines),
            error=stderr,
            figures=figures,
        )

    except subprocess.TimeoutExpired:
        return CodeResponse(
            output="",
            error=f"⏱️ Code execution timed out after {CODE_TIMEOUT_SECONDS} seconds.\n"
                  f"Check for infinite loops or reduce computation size.",
            figures=[],
        )
    except Exception as e:
        return CodeResponse(
            output="",
            error=f"Execution error: {str(e)}",
            figures=[],
        )
    finally:
        # Clean up temp file
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


# ---------------------------------------------------------------------------
# /api/curriculum  — return the week-topic map for the frontend
# ---------------------------------------------------------------------------
@app.get("/api/curriculum")
async def curriculum_endpoint():
    return {
        "weeks": {
            str(w): info["topic"] for w, info in CURRICULUM.items()
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
