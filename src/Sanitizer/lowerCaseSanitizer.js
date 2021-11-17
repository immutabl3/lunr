// Sanitizes text by converting to a locale-friendly lower-case version and triming leading and trailing whitespace.
export default function lowerCaseSanitizer(text) {
  return text ? text.toLocaleLowerCase().trim() : '';
};
