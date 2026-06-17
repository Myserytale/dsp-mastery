const ReactMarkdown = require('react-markdown');
const remarkMath = require('remark-math');
const rehypeKatex = require('rehype-katex');

const mathWith4 = `$$y(t) = T\\\\{x(t)\\\\} \\\\quad \\\\text{or} \\\\quad y[n] = T\\\\{x[n]\\\\}$$`;
const mathWith2 = `$$y(t) = T\\{x(t)\\} \\quad \\text{or} \\quad y[n] = T\\{x[n]\\}$$`;

console.log("With 4:", mathWith4);
console.log("With 2:", mathWith2);
