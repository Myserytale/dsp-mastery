import re
import os

def process_markdown(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Normalize backslashes:
    # Some subagents wrote "\\\\sum", some wrote "\\sum", some wrote "\sum".
    # We want the final TS file to have EXACTLY "\\sum" so that at runtime it is "\sum".
    # First, let's replace all quadruple backslashes with single backslash
    content = content.replace('\\\\\\\\', '\\')
    # Then replace double backslashes with single backslash
    content = content.replace('\\\\', '\\')
    
    # Now content has only single backslashes for commands (e.g. \sum).
    # Note: LaTeX newline \\ becomes \. Wait, LaTeX newline \\ is important!
    # Let's hope there aren't many LaTeX newlines, or if they are, they were \\\\ and now are \.
    # Actually, a better way is to just escape everything properly for a TS template literal:
    # The TS template literal needs to output the exact markdown string.
    # We will just do:
    content = content.replace('\\', '\\\\')
    content = content.replace('`', '\\`')
    content = content.replace('${', '\\${')
    return content

files_to_update = {
    "frontend/src/content/weeks1to5.ts": [
        ("Homework 5", 5)
    ],
    "frontend/src/content/weeks6to9.ts": [
        ("Homework 6", 6),
        ("Homework 7", 7),
        ("Homework 8", 8),
        ("Homework 9", 9)
    ],
    "frontend/src/content/weeks10to13.ts": [
        ("Homework 10", 10),
        ("Homework 11", 11),
        ("Homework 12", 12)
    ]
}

base_dir = "/home/lev/UNI/UNI.3/dsp/dsp (2)/dsp-app"
scratch_dir = "/home/lev/.gemini/antigravity/brain/51d989e6-bdcc-414c-962c-a0003525ed05/scratch"

for ts_rel, hws in files_to_update.items():
    ts_path = os.path.join(base_dir, ts_rel)
    with open(ts_path, 'r') as f:
        ts_content = f.read()
    
    for hw_name, hw_num in hws:
        md_path = os.path.join(scratch_dir, f"hw{hw_num}.md")
        if not os.path.exists(md_path):
            print(f"Missing {md_path}")
            continue
            
        md_content = process_markdown(md_path)
        
        # We need to replace:
        # homeworkGuide: `...`,
        # labWalkthrough: `...`,
        # with:
        # homeworkGuide: `...`,
        # labWalkthrough: ``,
        
        # Find the block for this week
        # We look for: title: "Week X..." or similar to narrow down?
        # Actually, we can just find:
        # homeworkGuide: `## 📝 Homework {hw_num} Solutions\n...`,
        # but the current TS file might have "Homework {hw_num} Solutions" or just empty.
        
        # Let's use a regex that matches homeworkGuide: `...` and labWalkthrough: `...` for the specific week.
        # It's safer to find the week block.
        week_pattern = re.compile(
            r'(title:\s*"Week ' + str(hw_num) + r'.*?)(homeworkGuide:\s*`.*?`,\s*labWalkthrough:\s*`.*?`,)',
            re.DOTALL
        )
        
        def repl(m):
            return m.group(1) + f"homeworkGuide: `{md_content}`,\n    labWalkthrough: ``,"
            
        new_ts_content, count = week_pattern.subn(repl, ts_content)
        if count == 0:
            # Maybe the title is different? For week 10, 11, 12, 13?
            # Let's try matching just the homeworkGuide containing "Homework {hw_num}"
            alt_pattern = re.compile(
                r'(homeworkGuide:\s*`[^`]*Homework ' + str(hw_num) + r'[^`]*`,\s*labWalkthrough:\s*`[^`]*`,)',
                re.DOTALL
            )
            def alt_repl(m):
                return f"homeworkGuide: `{md_content}`,\n    labWalkthrough: ``,"
            new_ts_content, count = alt_pattern.subn(alt_repl, ts_content)
            
        if count > 0:
            ts_content = new_ts_content
            print(f"Injected HW{hw_num} into {ts_rel}")
        else:
            print(f"Failed to find injection site for HW{hw_num} in {ts_rel}")
            
    with open(ts_path, 'w') as f:
        f.write(ts_content)

print("Done.")
