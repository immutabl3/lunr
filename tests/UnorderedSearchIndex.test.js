import test from 'tape';
import Search from '../src/Search.js';
import UnorderedSearchIndex from '../src/SearchIndex/UnorderedSearchIndex.js';

test('UnorderedSearchIndex', function(assert) {
  const search = Search('uid');
  search.searchIndex = UnorderedSearchIndex();
  search.addIndex('title');

  const titles = [
    'this document is about node.',
    'this document is about ruby.',
    'this document is about ruby and node.',
    'this document is about node. it has node examples'
  ];

  const documents = [];
  for (let i = 0, length = titles.length; i < length; ++i) {
    const document = {
      uid: i,
      title: titles[i]
    };

    documents.push(document);
    search.addDocument(document);
  }

  const validateSearchResults = function(results, expectedDocuments) {
    assert.is(results.length, expectedDocuments.length);
    
    expectedDocuments.forEach(document => {
      assert.ok(results.includes(document));
    });
  };

  assert.comment('should return documents matching search tokens');

  const results = search.search('node');
  validateSearchResults(results, [
    documents[0],
    documents[2],
    documents[3]
  ]);

  assert.end();
});