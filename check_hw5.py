with open('dsp-app/frontend/src/content/weeks1to5.ts', 'r') as f:
    text = f.read()

hw5_idx = text.find('homeworkGuide: `## 📝 Homework 5 Solutions')
if hw5_idx != -1:
    print(text[hw5_idx:hw5_idx+1000])
