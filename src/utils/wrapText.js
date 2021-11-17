export default function wrapText(text, tagName = 'mark') {
  return `<${tagName}>${text}</${tagName}>`;
};