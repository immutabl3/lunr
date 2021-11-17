import wrapText from './utils/wrapText.js';
import lowerCaseSanitizer from './Sanitizer/lowerCaseSanitizer.js';
import prefixIndexStrategy from './IndexStrategy/prefixIndexStrategy.js';

// This utility highlights the occurrences of tokens within a string of text. It can be used to give visual indicators
// of match criteria within searchable fields.
//
// For performance purposes this highlighter only works with full-word or prefix token indexes.
export default function TokenHighlighter(
  indexStrategy = prefixIndexStrategy,
  sanitize = lowerCaseSanitizer,
  wrapperTagName = 'mark',
) {
  const tagsLength = wrapText('', wrapperTagName).length;
  const tokenDictionary = new Map();

  // Highlights token occurrences within a string by wrapping them with a DOM element.
  //
  // @param txt e.g. "john wayne"
  // @param tokens e.g. ["wa"]
  // @returns {string} e.g. "john <mark>wa</mark>yne"
  return function highlight(rawText, tokens) {
    tokenDictionary.clear();

    // Create a token map for easier lookup below.
    for (const rawToken of tokens) {
      const token = sanitize(rawToken);
      const expandedTokens = indexStrategy(token);

      for (const expandedToken of expandedTokens) {
        if (!tokenDictionary.has(expandedToken)) {
          tokenDictionary.set(expandedToken, new Set([token]));
        } else {
          tokenDictionary.get(expandedToken).add(token);
        }
      }
    }

    // track actualCurrentWord and sanitizedCurrentWord separately in case we encounter nested tags
    let actualCurrentWord = '';
    let sanitizedCurrentWord = '';
    let currentWordStartIndex = 0;

    let text = rawText;
    // note this assumes either prefix or full word matching
    for (let i = 0, textLength = text.length; i < textLength; i++) {
      const character = text.charAt(i);

      if (character === ' ') {
        actualCurrentWord = '';
        sanitizedCurrentWord = '';
        currentWordStartIndex = i + 1;
      } else {
        actualCurrentWord += character;
        sanitizedCurrentWord += sanitize(character);
      }

      if (tokenDictionary.get(sanitizedCurrentWord)?.has(sanitizedCurrentWord)) {
        actualCurrentWord = wrapText(actualCurrentWord, wrapperTagName);
        text = text.substring(0, currentWordStartIndex) + actualCurrentWord + text.substring(i + 1);

        i += tagsLength;
        textLength += tagsLength;
      }
    }

    return text;
  };
};
