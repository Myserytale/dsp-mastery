import subprocess

hw_text = subprocess.check_output(['pdftotext', './homework/10/dsp_homework10.pdf', '-']).decode('utf-8')

with open('dsp-app/all_labs_dump.txt', 'r') as f:
    dump = f.read()

lab_start = dump.find('########## LAB 10 ##########')
lab_end = dump.find('########## LAB 11 ##########')
if lab_start != -1 and lab_end != -1:
    lab_text = dump[lab_start:lab_end]
else:
    lab_text = "Lab text not found correctly"

with open('hw10_prompt.txt', 'w') as f:
    f.write("=== HOMEWORK 10 QUESTIONS ===\n")
    f.write(hw_text)
    f.write("\n\n=== LAB 10 CODE ===\n")
    f.write(lab_text)

print("Extraction complete.")
