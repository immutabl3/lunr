import test from 'tape';
import Search from '../src/Search.js';

test('Search', function(assert) {
  const validateSearchResults = function(results, expectedDocuments) {
    assert.is(results.length, expectedDocuments.length);
    
    expectedDocuments.forEach(document => {
      assert.ok(results.includes(document));
    });
  };

  const setup = function() {
    return {
      search: Search('uid'),
      documentBar: {
        uid: 'bar',
        title: 'Bar',
        description: 'This is a document about bar',
        aNumber: 0,
        aBoolean: false,
      },
      documentBaz: {
        uid: 'baz',
        title: 'BAZ',
        description: 'All about baz',
        array: ['test', true, 456],
      },
      documentFoo: {
        uid: 'foo',
        title: 'foo',
        description: 'Is kung foo the same as kung fu?',
        aNumber: 167543,
        aBoolean: true,
        array: [123, 'test', 'foo'],
      },
      nestedDocumentFoo: {
        uid: 'foo',
        title: 'foo',
        description: 'Is kung foo the same as kung fu?',
        nested: {
          title: 'nested foo',
        },
      },
    };
  };

  assert.throws(() => Search(), 'should throw an error if instantiated without the :uidFieldName parameter');
  assert.doesNotThrow(() => Search('uid'), 'should not throw an error if instantiated with the :uidFieldName parameter');
  
  (function() {
    assert.comment('should find matches for all searchable fields');
    const { search, documentFoo } = setup();
    search.addIndex('title');
    search.addIndex('description');
    search.addDocument(documentFoo);
    // Search title text
    validateSearchResults(search.search('foo'), [documentFoo]);
    // Search description text
    validateSearchResults(search.search('kung'), [documentFoo]);
  }());

  (function() {
    assert.comment('should find no matches if none exist');
    const { search, documentFoo } = setup();
    search.addIndex('title');
    search.addDocument(documentFoo);
    validateSearchResults(search.search('xyz'), []);
  }());

  (function() {
    assert.comment('should find no matches if one token is empty');
    const { search, documentFoo } = setup();
    search.addIndex('title');
    search.addDocument(documentFoo);
    validateSearchResults(search.search('foo xyz'), []);
  }());

  (function() {
    assert.comment('should index and find non-string values if they can be converted to strings');
    const {
      search,
      documentFoo,
      documentBar,
    } = setup();
   
    search.addIndex('aBoolean');
    search.addIndex('aNumber');
    search.addDocument(documentBar);
    search.addDocument(documentFoo);

    validateSearchResults(search.search('167'), [documentFoo]);
    validateSearchResults(search.search('true'), [documentFoo]);
    validateSearchResults(search.search('0'), [documentBar]);
    validateSearchResults(search.search('false'), [documentBar]);
  }());

  (function() {
    assert.comment('should stringified arrays');
    const {
      search,
      documentFoo,
      documentBaz,
    } = setup();
    search.addIndex('array');
    search.addDocuments([documentFoo, documentBaz]);

    validateSearchResults(search.search('test'), [documentFoo, documentBaz]);
    validateSearchResults(search.search('true'), [documentBaz]);
    validateSearchResults(search.search('456'), [documentBaz]);
  }());

  (function() {
    assert.comment('should index nested document properties');
    const {
      search,
      nestedDocumentFoo,
    } = setup();
    search.addIndex(['nested', 'title']);
    search.addDocument(nestedDocumentFoo);

    validateSearchResults(search.search('nested foo'), [nestedDocumentFoo]);
  }());

  (function() {
    assert.comment('should gracefully handle broken property path');
    const {
      search,
      nestedDocumentFoo,
    } = setup();
    search.addIndex(['nested', 'title', 'not', 'existing']);
    search.addDocument(nestedDocumentFoo);

    validateSearchResults(search.search('nested foo'), []);
  }());

  (function() {
    assert.comment('should support nested uid paths');
    const melissaSmith = {
      name: 'Melissa Smith',
      email: 'melissa.allen@example.com',
      login: {
        userId: 2562,
        username: 'heavycat937',
      },
    };
    const johnSmith = {
      name: 'John Smith',
      email: 'john.allen@example.com',
      login: {
        userId: 54213,
        username: 'jhon123',
      },
    };

    const search = Search(['login', 'userId']);
    search.addIndex('title');
    search.addIndex(['login', 'username']);
    search.addIndex('name');
    search.addIndex('email');
    search.addDocuments([melissaSmith, johnSmith]);

    validateSearchResults(search.search('Smith'), [melissaSmith, johnSmith]);
    validateSearchResults(search.search('allen'), [melissaSmith, johnSmith]);
    validateSearchResults(search.search('heavycat937'), [melissaSmith]);
    validateSearchResults(search.search('jhon123'), [johnSmith]);
  });

  assert.end();
});
