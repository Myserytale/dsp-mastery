import re
import os

def process_markdown(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace('\\\\\\\\', '\\')
    content = content.replace('\\\\', '\\')
    
    content = content.replace('\\', '\\\\')
    content = content.replace('`', '\\`')
    content = content.replace('${', '\\${')
    return content

files_to_update = {
    "frontend/src/content/weeks1to5.ts": [5],
    "frontend/src/content/weeks6to9.ts": [6, 7, 8, 9],
    "frontend/src/content/weeks10to13.ts": [10, 11, 12]
}

base_dir = "/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app"
scratch_dir = "/home/lev/.gemini/antigravity/brain/51d989e6-bdcc-414c-962c-a0003525ed05/scratch"

def replace_week(content, hw_num, new_md):
    search_str = f"homeworkGuide: `## 📝 Homework {hw_num} Solutions"
    start_idx = content.find(search_str)
    if start_idx == -1:
        search_str = f"homeworkGuide: `## 📝 Homework {hw_num}"
        start_idx = content.find(search_str)
    if start_idx == -1 and hw_num == 12:
        search_str = "homeworkGuide: `## 📝 Homework 12"
        start_idx = content.find(search_str)
    if start_idx == -1:
        return content, False

    lab_start = content.find("labWalkthrough: `", start_idx)
    if lab_start == -1:
        return content, False
        
    next_prop = content.find("keyFormulas: `", lab_start)
    if next_prop != -1:
        end_idx = content.rfind("`,", lab_start, next_prop)
    else:
        end_obj = content.find("  },", lab_start)
        if end_obj == -1:
            end_obj = content.find("  }", lab_start)
        end_idx = content.rfind("`,", lab_start, end_obj)

    if end_idx == -1:
        return content, False
        
    end_idx += 2 # include `,`

    replacement = f"homeworkGuide: `{new_md}`,\n    labWalkthrough: ``,"
    new_content = content[:start_idx] + replacement + content[end_idx:]
    return new_content, True

for ts_rel, hws in files_to_update.items():
    ts_path = os.path.join(base_dir, ts_rel)
    with open(ts_path, 'r') as f:
        ts_content = f.read()
    
    for hw_num in hws:
        md_path = os.path.join(scratch_dir, f"hw{hw_num}.md")
        if not os.path.exists(md_path):
            print(f"Missing {md_path}")
            continue
            
        md_content = process_markdown(md_path)
        ts_content, success = replace_week(ts_content, hw_num, md_content)
        
        if success:
            print(f"Injected HW{hw_num} into {ts_rel}")
        else:
            print(f"Failed to find injection site for HW{hw_num} in {ts_rel}")
            
    with open(ts_path, 'w') as f:
        f.write(ts_content)

print("Done.")
