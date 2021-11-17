import test from 'tape';
import simpleTokenizer from '../src/Tokenizer/simpleTokenizer.js';
import StopWordsTokenizer from '../src/Tokenizer/StopWordsTokenizer.js';
import stopWords from '../src/stopWords.js';

test('StopWordsTokenizer', function(assert) {
  (function() {
    const tokenize = StopWordsTokenizer(simpleTokenizer);
    assert.same(tokenize(''), [], 'should handle empty values');
    assert.same(tokenize(' '), [], 'should handle empty values');
  }());

  (function() {
    const tokenize = StopWordsTokenizer(simpleTokenizer);
    assert.same(tokenize('software'), ['software'], 'should not remove tokens that are not stop words');
  }());

  (function() {
    const tokenize = StopWordsTokenizer(simpleTokenizer);
    assert.same(tokenize('and testing'), ['testing'], 'should remove stop word tokens');
  }());

  (function() {
    const tokenize = StopWordsTokenizer(simpleTokenizer);
    assert.same(tokenize('a and the'), [], 'should handle all stop word token sets');
  }());

  (function() {
    const tokenize = StopWordsTokenizer(simpleTokenizer);
    assert.same(tokenize('constructor'), ['constructor'], 'should not remove Object.prototype properties');
    assert.same(tokenize('hasOwnProperty'), ['hasOwnProperty'], 'should not remove Object.prototype properties');
    assert.same(tokenize('toString'), ['toString'], 'should not remove Object.prototype properties');
    assert.same(tokenize('valueOf'), ['valueOf'], 'should not remove Object.prototype properties');
  }());

  (function() {
    const tokenize = StopWordsTokenizer(simpleTokenizer);
    stopWords.delete('the');
    assert.same(tokenize('a and the'), ['the'], 'should allow stop-words to be overridden');
    stopWords.add('the');
  }());

  assert.end();
});