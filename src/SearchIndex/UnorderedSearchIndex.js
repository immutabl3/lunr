import tokenToKey from '../utils/tokenToKey.js';

// Search index capable of returning results matching a set of tokens but without any meaningful rank or order.
export default function UnorderedSearchIndex() {
  const tokenToUidToDocumentMap = new Map();
  const intersectingDocumentMap = new Map();
  
  return {
    indexDocument(token, uid, doc) {
      const key = tokenToKey(token);
      if (!tokenToUidToDocumentMap.has(key)) {
        tokenToUidToDocumentMap.set(key, new Map([
          [uid, doc]
        ]));
        return;
      }

      tokenToUidToDocumentMap.get(key).set(uid, doc);
    },

    search(tokens) {
      intersectingDocumentMap.clear();

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const key = tokenToKey(token);
        
        // short circuit if no matches were found for any given token.
        if (!tokenToUidToDocumentMap.has(key)) return [];
        
        const documentMap = tokenToUidToDocumentMap.get(key);

        if (i === 0) {
          for (const [uid, doc] of documentMap.entries()) {
            intersectingDocumentMap.set(uid, doc);
          }
        } else {
          for (const uid of intersectingDocumentMap.keys()) {
            if (documentMap.has(uid)) continue;
            intersectingDocumentMap.delete(uid);
          }
        }
      }

      return Array.from(intersectingDocumentMap.values());
    },
  };
};
