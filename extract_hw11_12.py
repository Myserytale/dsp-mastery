import subprocess

for i in [11, 12]:
    hw_text = subprocess.check_output(['pdftotext', f'./homework/{i}/dsp_homework{i}.pdf', '-']).decode('utf-8')
    with open('dsp-app/all_labs_dump.txt', 'r') as f:
        dump = f.read()

    lab_start = dump.find(f'########## LAB {i} ##########')
    lab_end = dump.find(f'########## LAB {i+1} ##########')
    if lab_start != -1 and lab_end != -1:
        lab_text = dump[lab_start:lab_end]
    else:
        lab_text = "Lab text not found correctly"

    with open(f'hw{i}_prompt.txt', 'w') as f:
        f.write(f"=== HOMEWORK {i} QUESTIONS ===\n")
        f.write(hw_text)
        f.write(f"\n\n=== LAB {i} CODE ===\n")
        f.write(lab_text)

print("Extraction 11 and 12 complete.")
