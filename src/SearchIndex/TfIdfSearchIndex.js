import { get } from '@immutabl3/utils';
import tokenToKey from '../utils/tokenToKey.js';

// Search index capable of returning results matching a set of tokens and ranked according to TF-IDF.
export default function TfIdfSearchIndex(uidFieldName) {
  const uidToDocumentMap = new Map();
  const tokenToIdfCache = new Map();
  const tokenMap = new Map();

  const access = Array.isArray(uidFieldName)
    ? document => get(document, uidFieldName)
    : document => document[uidFieldName];

  const calculateIdf = function(token, documents) {
    if (tokenToIdfCache.has(token)) return tokenToIdfCache.get(token);
    
    const numDocumentsWithToken = tokenMap.get(token)?.numDocumentOccurrences ?? 0;
    const value = 1 + Math.log(documents.length / (1 + numDocumentsWithToken));
    tokenToIdfCache.set(token, value);
    return value;
  };

  const calculateTfIdf = function(tokens, document, documents) {
    let score = 0;

    for (const token of tokens) {
      const freq = calculateIdf(token, documents);
      const inverseDocumentFrequency = freq !== Infinity ? freq : 0;
      const uid = access(document);
      const termFrequency = tokenMap.get(token)?.uidMap.get(uid)?.numTokenOccurrences ?? 0;

      score += termFrequency * inverseDocumentFrequency;
    }

    return score;
  };

  return {
    calculateIdf,
    calculateTfIdf,

    indexDocument(token, uid, doc) {
      // new index invalidates previous IDF caches
      tokenToIdfCache.clear();

      const key = tokenToKey(token);

      let tokenDatum;
      if (!tokenMap.has(key)) {
        tokenDatum = {
          numDocumentOccurrences: 0,
          totalNumOccurrences: 1,
          uidMap: new Map(),
        };
        tokenMap.set(key, tokenDatum);
      } else {
        tokenDatum = tokenMap.get(key);
        tokenDatum.totalNumOccurrences++;
      }

      const { uidMap } = tokenDatum;
      if (!uidMap.has(uid)) {
        tokenDatum.numDocumentOccurrences++;
        uidMap.set(uid, {
          document: doc,
          numTokenOccurrences: 1,
        });
      } else {
        uidMap.get(uid).numTokenOccurrences++;
      }
    },

    search(tokens, corpus) {
      uidToDocumentMap.clear();
      
      // handle first token
      const token = tokens[0];
      const key = tokenToKey(token);
      // short circuit if no matches were found for any given token
      if (!tokenMap.has(key)) return [];
      const tokenMetadata = tokenMap.get(key);
      for (const uid of tokenMetadata.uidMap.keys()) {
        uidToDocumentMap.set(uid, tokenMetadata.uidMap.get(uid).document);
      }
      
      // handle rest of the tokens
      for (let i = 1; i < tokens.length; i++) {
        const token = tokens[i];
        const key = tokenToKey(token);

        // short circuit if no matches were found for any given token
        if (!tokenMap.has(key)) return [];

        const tokenMetadata = tokenMap.get(key);

        for (const uid of uidToDocumentMap.keys()) {
          if (tokenMetadata.uidMap.has(uid)) continue;
          uidToDocumentMap.delete(uid);
        }
      }

      // return documents sorted by TF-IDF
      return Array.from(uidToDocumentMap.values())
        .sort((documentA, documentB) =>
          calculateTfIdf(tokens, documentB, corpus) -
          calculateTfIdf(tokens, documentA, corpus)
        );
    },
  };
};
