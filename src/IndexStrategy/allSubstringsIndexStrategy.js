// Indexes for all substring searches (e.g. the term "cat" is indexed as "c", "ca", "cat", "a", "at", and "t").
export default function allSubstringsIndexStrategy(token) {
  const expandedTokens = [];
  let string;

  for (let i = 0, length = token.length; i < token.length; ++i) {
    string = '';

    for (let idx = i; idx < length; ++idx) {
      string += token.charAt(idx);
      expandedTokens.push(string);
    }
  }

  return expandedTokens;
};
