import test from 'tape';
import simpleTokenizer from '../src/Tokenizer/simpleTokenizer.js';
import StemmingTokenizer from '../src/Tokenizer/StemmingTokenizer.js';

test('StemmingTokenizer', function(assert) {
  const stemmingFunction = text => text === 'cats' ? 'cat' : text;
  const tokenize = StemmingTokenizer(stemmingFunction, simpleTokenizer);

  assert.same(tokenize(''), [], 'should handle empty values');
  assert.same(tokenize(' '), [], 'should handle blank values');
  assert.same(tokenize('the cats'), ['the', 'cat'], 'should convert words to stems');

  assert.end();
});