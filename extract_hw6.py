import subprocess

hw_text = subprocess.check_output(['pdftotext', './homework/06/dsp_homework06.pdf', '-']).decode('utf-8')

with open('dsp-app/all_labs_dump.txt', 'r') as f:
    dump = f.read()

lab_start = dump.find('########## LAB 06 ##########')
lab_end = dump.find('########## LAB 07 ##########')
if lab_start != -1 and lab_end != -1:
    lab_text = dump[lab_start:lab_end]
else:
    lab_text = "Lab text not found correctly"

with open('hw6_prompt.txt', 'w') as f:
    f.write("=== HOMEWORK 6 QUESTIONS ===\n")
    f.write(hw_text)
    f.write("\n\n=== LAB 06 CODE ===\n")
    f.write(lab_text)

print("Extraction complete.")
