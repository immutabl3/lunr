import stopWords from '../stopWords.js';

const isNotStopWord = token => !stopWords.has(token);

// Stop words are very common (e.g. "a", "and", "the") and are often not semantically meaningful in the context of a
// search. This tokenizer removes stop words from a set of tokens before passing the remaining tokens along for
// indexing or searching purposes.
export default function stopWordsTokenizer(tokenize) {
  return function stopWordsTokenize(text) {
    return tokenize(text).filter(isNotStopWord);
  };
};
