import json

log_path = "/home/lev/.gemini/antigravity/brain/87c32ff5-e648-4e3f-99d9-faeb16e3e28d/.system_generated/logs/transcript.jsonl"
with open(log_path, 'r') as f:
    for line in f:
        data = json.loads(line)
        if data.get("source") == "MODEL":
            content = data.get("content", "")
            if "## 📝 Homework 8 Solutions" in content:
                with open("/home/lev/.gemini/antigravity/brain/51d989e6-bdcc-414c-962c-a0003525ed05/scratch/hw8.md", "w") as out:
                    out.write(content)
                print("Found and wrote HW8")
                break
