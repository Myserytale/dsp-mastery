import subprocess

hw_text = subprocess.check_output(['pdftotext', './homework/05/dsp_homework05.pdf', '-']).decode('utf-8')

with open('dsp-app/all_labs_dump.txt', 'r') as f:
    dump = f.read()

lab_start = dump.find('########## LAB 05 ##########')
lab_end = dump.find('########## LAB 06 ##########')
if lab_start != -1 and lab_end != -1:
    lab_text = dump[lab_start:lab_end]
else:
    lab_text = "Lab text not found correctly"

with open('hw5_prompt.txt', 'w') as f:
    f.write("=== HOMEWORK 5 QUESTIONS ===\n")
    f.write(hw_text)
    f.write("\n\n=== LAB 05 CODE ===\n")
    f.write(lab_text)

print("Extraction complete.")
