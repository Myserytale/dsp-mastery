import os
import glob
from langchain_community.document_loaders import PyMuPDFLoader, NotebookLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

# The base directory where the course materials are located
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

SLIDES_DIR = os.path.join(BASE_DIR, 'slides')
HOMEWORK_DIR = os.path.join(BASE_DIR, 'homework')
LABS_DIR = os.path.join(BASE_DIR, 'labs')

# ChromaDB local persistence directory
CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(__file__), 'chroma_db')

def get_files(directory, extension):
    return glob.glob(os.path.join(directory, f'**/*{extension}'), recursive=True)

def load_documents():
    documents = []
    
    print(f"Loading slides from {SLIDES_DIR}...")
    slide_files = get_files(SLIDES_DIR, '.pdf')
    for file in slide_files:
        loader = PyMuPDFLoader(file)
        docs = loader.load()
        for doc in docs:
            doc.metadata['source_type'] = 'lecture_slide'
        documents.extend(docs)
        
    print(f"Loading homework from {HOMEWORK_DIR}...")
    homework_files = get_files(HOMEWORK_DIR, '.pdf')
    for file in homework_files:
        loader = PyMuPDFLoader(file)
        docs = loader.load()
        for doc in docs:
            doc.metadata['source_type'] = 'homework'
        documents.extend(docs)
        
    print(f"Loading labs from {LABS_DIR}...")
    lab_files = get_files(LABS_DIR, '.ipynb')
    for file in lab_files:
        loader = NotebookLoader(file, include_outputs=False, max_output_length=0, remove_newline=True)
        docs = loader.load()
        for doc in docs:
            doc.metadata['source_type'] = 'lab_notebook'
        documents.extend(docs)
        
    return documents

def main():
    documents = load_documents()
    print(f"Loaded {len(documents)} document pages/cells.")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    print("Splitting documents into chunks...")
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks.")

    print("Initializing Ollama Embeddings (qwen2.5:14b)...")
    embeddings = OllamaEmbeddings(model="qwen2.5:14b")

    print(f"Persisting chunks to ChromaDB at {CHROMA_PERSIST_DIR}...")
    db = Chroma(persist_directory=CHROMA_PERSIST_DIR, embedding_function=embeddings)
    
    # Batch insertion is safe for local Ollama without rate limiting concerns
    print("Adding chunks to Vector Store...")
    db.add_documents(chunks)

    print("\nIngestion complete. The Knowledge Matrix is ready.")

if __name__ == "__main__":
    main()
