import json

transcript_path = "/home/lev/.gemini/antigravity/brain/46fa2b7b-41bd-40fa-b3e9-4e6c2459b5ec/.system_generated/logs/transcript.jsonl"

with open(transcript_path, "r") as f:
    lines = f.readlines()

latest_content = None

for line in lines:
    try:
        data = json.loads(line)
        if "tool_calls" in data:
            for tc in data["tool_calls"]:
                if tc.get("function_name") == "multi_replace_file_content":
                    args = tc.get("function_args", {})
                    # The subagent used multi_replace_file_content to rewrite strings!
                    # Actually wait, maybe it didn't rewrite the whole file, it just replaced the strings.
                    # Let me print what it did.
                    print("Found multi_replace_file_content")
                if tc.get("function_name") == "replace_file_content":
                    args = tc.get("function_args", {})
                    # If it used replace_file_content, let's see.
                    print("Found replace_file_content")
    except Exception as e:
        pass

