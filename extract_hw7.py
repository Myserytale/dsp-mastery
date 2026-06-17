import subprocess

hw_text = subprocess.check_output(['pdftotext', './homework/07/dsp_homework07.pdf', '-']).decode('utf-8')

with open('dsp-app/all_labs_dump.txt', 'r') as f:
    dump = f.read()

lab_start = dump.find('########## LAB 07 ##########')
lab_end = dump.find('########## LAB 08 ##########')
if lab_start != -1 and lab_end != -1:
    lab_text = dump[lab_start:lab_end]
else:
    lab_text = "Lab text not found correctly"

with open('hw7_prompt.txt', 'w') as f:
    f.write("=== HOMEWORK 7 QUESTIONS ===\n")
    f.write(hw_text)
    f.write("\n\n=== LAB 07 CODE ===\n")
    f.write(lab_text)

print("Extraction complete.")
