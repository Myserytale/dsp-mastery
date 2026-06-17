with open('dsp-app/frontend/src/content/weeks6to9.ts', 'r') as f:
    text = f.read()

hw_count = text.count('homeworkGuide: `## 📝 Homework')
print("Homework guides found:", hw_count)

# Print a snippet of HW 6
hw6_idx = text.find('homeworkGuide: `## 📝 Homework 6')
if hw6_idx != -1:
    print(text[hw6_idx:hw6_idx+300])

