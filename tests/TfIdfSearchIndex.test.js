import test from 'tape';
import Search from '../src/Search.js';
import TfIdfSearchIndex from '../src/SearchIndex/TfIdfSearchIndex.js';

test('TfIdfSearchIndex', function(assert) {
  const setup = function() {
    const documents = [];
    let uid = 0;

    const search = Search('uid');
    search.searchIndex = TfIdfSearchIndex('uid');
    search.addIndex('title');

    const addDocument = function(title) {
      const document = {
        uid: ++uid,
        title,
      };

      documents.push(document);
      search.addDocument(document);

      return document;
    };

    [
      'this document is about node.',
      'this document is about ruby.',
      'this document is about ruby and node.',
      'this document is about node. it has node examples',
    ].forEach(addDocument);

    return {
      addDocument,
      documents,
      search,
      uid,
    };
  };

  (function() {
    const { addDocument } = setup();
    assert.doesNotThrow(() => addDocument('constructor'), 'should handle special words like "constructor"');
  }());

  const calculateIdf = function(search, numDocumentsWithToken) {
    return 1 + Math.log(search.documents.length / (1 + numDocumentsWithToken));
  };
  const searchIdf = function(search, term) {
    return search.searchIndex.calculateIdf(term, search.documents);
  };

  (function() {
    const { search } = setup();
    assert.same(
      searchIdf(search, 'and'),
      calculateIdf(search, 1),
      'IDF: should compute for tokens appearing only once',
    );
  }());

  (function() {
    const { search } = setup();
    assert.same(
      searchIdf(search, 'document'),
      calculateIdf(search, 4),
      'IDF: should compute for tokens appearing once in each document',
    );
  }());

  (function() {
    const { search } = setup();
    assert.same(
      searchIdf(search, 'node'),
      calculateIdf(search, 3),
      'IDF: should compute for tokens appearing multiple times in a document',
    );
  }());

  (function() {
    const { search } = setup();
    assert.same(
      searchIdf(search, 'foobar'),
      calculateIdf(search, 0),
      'IDF: should compute for tokens that are not within the corpus',
    );
  }());

  (function() {
    const { search, addDocument } = setup();

    assert.same(
      searchIdf(search, 'ruby'),
      calculateIdf(search, 2),
      'IDF: should clear IFD cache if new documents are indexed',
    );

    addDocument('this document is not about ruby.');

    assert.same(
      searchIdf(search, 'ruby'),
      calculateIdf(search, 3),
      'IDF: should clear IFD cache if new documents are indexed',
    );
  }());

  const calculateTfIdf = function(search, numDocumentsWithToken, tokenCountInDocument) {
    return calculateIdf(search, numDocumentsWithToken) * tokenCountInDocument;
  };

  const searchTfIdf = function(search, terms, document) {
    return search.searchIndex.calculateTfIdf(terms, document, search.documents);
  };

  (function() {
    const { search, documents } = setup();
    assert.same(
      searchTfIdf(search, ['node'], documents[0]),
      calculateTfIdf(search, 3, 1),
      'TF-IDF: should compute for single tokens within the corpus',
    );
    assert.same(
      searchTfIdf(search, ['node'], documents[3]),
      calculateTfIdf(search, 3, 2),
      'TF-IDF: should compute for single tokens within the corpus',
    );
  }());

  (function() {
    const { search, documents } = setup();
    assert.same(
      searchTfIdf(search, ['node'], documents[1]),
      calculateTfIdf(search, 3, 0),
      'TF-IDF: should compute for tokens not within the document',
    );
    assert.same(
      searchTfIdf(search, ['has node'], documents[1]),
      calculateTfIdf(search, 3, 0),
      'TF-IDF: should compute for tokens not within the document',
    );
  }());

  (function() {
    const { search, documents } = setup();
    assert.same(
      searchTfIdf(search, ['document', 'node'], documents[3]),
      calculateTfIdf(search, 4, 1) + calculateTfIdf(search, 3, 2),
      'TF-IDF: should compute for multiple tokens within the corpus',
    );
    assert.same(
      searchTfIdf(search, ['ruby', 'and'], documents[2]),
      calculateTfIdf(search, 2, 1) + calculateTfIdf(search, 1, 1),
      'TF-IDF: should compute for multiple tokens within the corpus',
    );
  }());

  (function() {
    const { search } = setup();
    assert.same(
      searchTfIdf(search, ['foobar'], []),
      calculateTfIdf(search, 0, 0),
      'TF-IDF: should compute for tokens that are not within the corpus',
    );
    assert.same(
      searchTfIdf(search, ['foo', 'bar'], []),
      calculateTfIdf(search, 0, 0),
      'TF-IDF: should compute for tokens that are not within the corpus',
    );
  }());

  (function() {
    const { search, documents } = setup();
    const results = search.search('node');

    assert.is(results.length, 3, 'search: should order search results by TF-IDF descending');

    // The 4th document has "node" twice so it should be first of the 3
    // The order of the other results isn't important for this test.
    assert.is(results[0], documents[3], 'search: should order search results by TF-IDF descending');
  }());

  (function() {
    const { search, addDocument } = setup();
    const documentA = addDocument('foo bar foo bar baz baz baz baz');
    const documentB = addDocument('foo bar foo foo baz baz baz baz');
    const documentC = addDocument('foo bar baz bar baz baz baz baz');

    for (let i = 0; i < 10; i++) {
      addDocument('foo foo baz foo foo baz foo foo baz foo foo baz foo foo baz foo foo baz foo foo baz foo foo');
    }

    const results = search.search('foo bar');

    assert.is(results.length, 3, 'search: should give documents containing words with a lower IDF a higher relative ranking');

    assert.is(results[0], documentA, 'search: document A should come first because it has 2 "bar" (which have a lower total count) and 2 "foo"');
    assert.is(results[1], documentC, 'search: document C should come first because it has 2 "bar" (which have a lower total count) but only 1 "foo"');
    assert.is(results[2], documentB, 'search: document B should come last because although it has 3 "foo" it has only 1 "bar"');
  }());

  (function() {
    const melissaSmith = {
      name: 'Melissa Smith',
      login: {
        userId: 2562,
      },
    };
    const johnSmith = {
      name: 'John Smith',
      login: {
        userId: 54213,
      },
    };

    const searchIndex = TfIdfSearchIndex(['login', 'userId']);
    searchIndex.indexDocument(['Melissa'], 2562, melissaSmith);
    searchIndex.indexDocument(['Smith'], 2562, melissaSmith);
    searchIndex.indexDocument(['John'], 54213, johnSmith);
    searchIndex.indexDocument(['Smith'], 54213, johnSmith);

    assert.same(searchIndex.search(['Melissa'], [melissaSmith, johnSmith]), [melissaSmith], 'should support nested uid paths');
    assert.same(searchIndex.search(['John'], [melissaSmith, johnSmith]), [johnSmith], 'should support nested uid paths');
    assert.same(searchIndex.search(['Smith'], [melissaSmith, johnSmith]), [melissaSmith, johnSmith], 'should support nested uid paths');
  }());

  assert.end();
});
