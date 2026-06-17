import json
import glob
import os

logs_dir = "/home/lev/.gemini/antigravity/brain/*/.system_generated/logs/transcript.jsonl"
for log_path in glob.glob(logs_dir):
    try:
        with open(log_path, 'r') as f:
            for line in f:
                data = json.loads(line)
                if data.get("source") == "MODEL":
                    content = data.get("content", "")
                    for hw_num in [10, 11, 12]:
                        if f"## 📝 Homework {hw_num} Solutions" in content:
                            out_path = f"/home/lev/.gemini/antigravity/brain/51d989e6-bdcc-414c-962c-a0003525ed05/scratch/hw{hw_num}.md"
                            with open(out_path, "w") as out:
                                out.write(content)
                            print(f"Found and wrote HW{hw_num} from {log_path}")
    except Exception as e:
        print(f"Error {log_path}: {e}")
