// Stemming is the process of reducing search tokens to their root (or stem) so that searches for different forms of a
// word will match. For example "search", "searching" and "searched" are all reduced to the stem "search".
//
// This stemming tokenizer converts tokens (words) to their stem forms before returning them. It requires an
// external stemming function to be provided; for this purpose I recommend the NPM 'porter-stemmer' library
//
// For more information see http://tartarus.org/~martin/PorterStemmer/
export default function StemmingTokenizer(stemmingFunction, tokenize) {
  return function stemmingTokenize(text) {
    return tokenize(text).map(stemmingFunction);
  };
};
