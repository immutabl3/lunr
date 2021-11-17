import { identity } from '@immutabl3/utils';

const REGEX = /[^a-zа-яё0-9\-']+/i;

// Simple tokenizer that splits strings on whitespace characters and returns an array of all non-empty substrings.
export default function simpleTokenizer(text) {
  return text
    .split(REGEX)
    // filter empty tokens
    .filter(identity);
};
