function extractText(children) {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && children.props && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
}
console.log(extractText(["a", {props: {children: ["b", "c"]}}]));
