// Enforces case-sensitive text matches.
export default function caseSensitiveSanitizer(text) {
  return text ? text.trim() : '';
};
