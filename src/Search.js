import lowerCaseSanitizer from './Sanitizer/lowerCaseSanitizer.js';
import TfIdfSearchIndex from './SearchIndex/TfIdfSearchIndex.js';
import simpleTokenizer from './Tokenizer/simpleTokenizer.js';
import prefixIndexStrategy from './IndexStrategy/prefixIndexStrategy.js';
import {
  get,
  isString,
} from '@immutabl3/utils';

// Simple client-side searching within a set of documents.
//
// <p>Documents can be searched by any number of fields. Indexing and search strategies are highly customizable.
//
// @param uidFieldName Field containing values that uniquely identify search documents; this field's values are used
//                     to ensure that a search result set does not contain duplicate objects.
export default function Search(uidFieldName) {
  if (!uidFieldName) throw 'search: uid field name required';
  
  let initialized = false;

  // default/recommended strategies
  let indexStrategy = prefixIndexStrategy;
  let searchIndex = TfIdfSearchIndex(uidFieldName);
  let sanitizer = lowerCaseSanitizer;
  let tokenizer = simpleTokenizer;

  const documents = [];
  // contains either a property name or a path (list of property names) to a nested value
  const searchableFields = [];

  // @param documents
  // @param searchableFields Array containing property names and paths (lists of property names) to nested values
  const indexDocuments = function(documents, searchableFields) {
    initialized = true;

    for (const document of documents) {
      const uid = Array.isArray(uidFieldName)
        ? get(document, uidFieldName)
        : document[uidFieldName];

      for (const searchableField of searchableFields) {
        const fieldValue = (
          Array.isArray(searchableField)
            ? get(document, searchableField)
            : document[searchableField]
        )?.toString();

        if (!isString(fieldValue)) continue;

        const fieldTokens = tokenizer(sanitizer(fieldValue));

        for (const fieldToken of fieldTokens) {
          const expandedTokens = indexStrategy(fieldToken);

          for (const expandedToken of expandedTokens) {
            searchIndex.indexDocument(expandedToken, uid, document);
          }
        }
      }
    }
  };

  return {
    get documents() {
      return [...documents];
    },

    set indexStrategy(value) {
      if (initialized) throw 'indexStrategy cannot be set after initialization';

      indexStrategy = value;
    },

    get indexStrategy() {
      return indexStrategy;
    },

    set sanitizer(value) {
      if (initialized) throw 'sanitizer cannot be set after initialization';

      sanitizer = value;
    },
    get sanitizer() {
      return sanitizer;
    },

    set searchIndex(value) {
      if (initialized) throw 'searchIndex cannot be set after initialization';

      searchIndex = value;
    },
    get searchIndex() {
      return searchIndex;
    },

    set tokenizer(value) {
      if (initialized) throw 'tokenizer cannot be set after initialization';

      tokenizer = value;
    },
    get tokenizer() {
      return tokenizer;
    },

    // Add a searchable document to the index. Document will automatically be indexed for search.
    // @param document
    addDocument(doc) {
      documents.push(doc);
      indexDocuments([doc], searchableFields);
    },

    // Adds searchable documents to the index. Documents will automatically be indexed for search.
    // @param document
    addDocuments(docs) {
      documents.push(...docs);
      indexDocuments(docs, searchableFields);
    },

    // Add a new searchable field to the index. Existing documents will automatically be indexed using this new field.
    // @param field Searchable field or field path. Pass a string to index a top-level field and an array of strings for nested fields.
    addIndex(field) {
      searchableFields.push(field);
      indexDocuments(documents, [field]);
    },

    // Search all documents for ones matching the specified query text.
    // @param query
    // @returns {Array<Object>}
    search(query) {
      return searchIndex.search(
        tokenizer(sanitizer(query)),
        documents,
      );
    },
  };
};
