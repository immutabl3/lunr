export { default as Search } from './src/Search.js';

export { default as stopWords } from './src/stopWords.js';
export { default as TokenHighlighter } from './src/TokenHighlighter.js';

export { default as allSubstringsIndexStrategy } from './src/IndexStrategy/allSubstringsIndexStrategy.js';
export { default as exactWordIndexStrategy } from './src/IndexStrategy/exactWordIndexStrategy.js';
export { default as prefixIndexStrategy } from './src/IndexStrategy/prefixIndexStrategy.js';

export { default as lowerCaseSanitizer } from './src/Sanitizer/lowerCaseSanitizer.js';
export { default as caseSensitiveSanitizer } from './src/Sanitizer/caseSensitiveSanitizer.js';

export { default as TfIdfSearchIndex } from './src/SearchIndex/TfIdfSearchIndex.js';
export { default as UnorderedSearchIndex } from './src/SearchIndex/UnorderedSearchIndex.js';

export { default as simpleTokenizer } from './src/Tokenizer/simpleTokenizer.js';
export { default as StemmingTokenizer } from './src/Tokenizer/StemmingTokenizer.js';
export { default as StopWordsTokenizer } from './src/Tokenizer/StopWordsTokenizer.js';