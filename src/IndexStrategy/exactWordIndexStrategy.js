// Indexes for exact word matches.
export default function exactWordIndexStrategy(token) {
  return token ? [token] : [];
};
