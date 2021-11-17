import test from 'tape';
import tokenize from '../src/Tokenizer/simpleTokenizer.js';

test('simpleTokenizer', function(assert) {
  assert.same(tokenize('a'), ['a'], 'should convert single-token strings');
  assert.same(tokenize('a b c'), ['a', 'b', 'c'], 'should convert multi-token strings');
  assert.same(tokenize('  a  '), ['a'], 'should not return empty tokens');
  assert.same(tokenize('this and, this.'), ['this', 'and', 'this'], 'should remove punctuation');
  assert.same(tokenize('billy-bob'), ['billy-bob'], 'should not remove hyphens');
  assert.same(tokenize(`it's`), [`it's`], 'should not remove apostrophes');
  assert.same(
    tokenize('Есть хоть одна девушка, которую ты хочешь? Или ты устал от женщин'),
    [
      'Есть',
      'хоть',
      'одна',
      'девушка',
      'которую',
      'ты',
      'хочешь',
      'Или',
      'ты',
      'устал',
      'от',
      'женщин'
    ],
    'should handle cyrillic'
  );
  assert.end();
});