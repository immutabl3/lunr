// Indexes for prefix searches (e.g. the term "cat" is indexed as "c", "ca", and "cat" allowing prefix search lookups).
export default function prefixIndexStrategy(token) {
  const expandedTokens = new Array(token.length);

  let string = '';
  for (let i = 0; i < token.length; ++i) {
    string += token.charAt(i);
    expandedTokens[i] = string;
  }

  return expandedTokens;
};
