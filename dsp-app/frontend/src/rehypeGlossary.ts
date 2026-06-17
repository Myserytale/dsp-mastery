import { visit, SKIP } from 'unist-util-visit';

export function rehypeGlossary(options: { glossary: Record<string, string> }) {
  const { glossary } = options;
  const terms = Object.keys(glossary).filter(t => t.trim().length > 0).sort((a, b) => b.length - a.length);
  
  if (terms.length === 0) return () => {};

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexStr = `\\b(${terms.map(escapeRegExp).join('|')})\\b`;
  const regex = new RegExp(regexStr, 'gi');

  return (tree: any) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      // Skip code blocks, preformatted text, and math equations
      if (node.type === 'element') {
        const tagName = node.tagName?.toLowerCase();
        const className = Array.isArray(node.properties?.className) 
          ? node.properties.className.join(' ') 
          : (node.properties?.className || '');
        
        if (tagName === 'code' || tagName === 'pre' || className.includes('katex') || className.includes('glossary-term')) {
          return SKIP;
        }
      }

      // Process text nodes
      if (node.type === 'text' && node.value && index !== undefined && parent) {
        const text = node.value;
        const matches = Array.from(text.matchAll(regex)) as RegExpMatchArray[];
        
        if (matches.length === 0) return;

        const newNodes: any[] = [];
        let lastIndex = 0;

        for (const match of matches) {
          const matchStart = match.index!;
          const matchEnd = matchStart + match[0].length;
          const term = match[0];

          if (matchStart > lastIndex) {
            newNodes.push({ type: 'text', value: text.slice(lastIndex, matchStart) });
          }

          // Find exact case-sensitive key from glossary dictionary
          const exactKey = terms.find(t => t.toLowerCase() === term.toLowerCase()) || term;

          newNodes.push({
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['glossary-term', 'cursor-help', 'border-b', 'border-dashed', 'border-nord-aurora-yellow/70', 'hover:bg-nord-aurora-yellow/10', 'rounded', 'transition-colors'],
              'data-glossary-term': exactKey
            },
            children: [{ type: 'text', value: term }]
          });

          lastIndex = matchEnd;
        }
        
        if (lastIndex < text.length) {
          newNodes.push({ type: 'text', value: text.slice(lastIndex) });
        }

        // Replace the original text node with the new nodes
        parent.children.splice(index, 1, ...newNodes);
        
        // Skip over the newly inserted nodes
        return index + newNodes.length;
      }
    });
  };
}
