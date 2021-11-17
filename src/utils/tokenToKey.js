export default function tokenToKey(token) {
  return Array.isArray(token) ? token.join(',') : token;
};
