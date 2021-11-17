import test from 'tape';
import TokenHighlighter from '../src/TokenHighlighter.js';
import wrapText from '../src/utils/wrapText.js';

test('TokenHighlighter', function(assert) {
  (function() {
    const tokenHighlighter = TokenHighlighter();
    const text = '';
    assert.is(tokenHighlighter(text, []), '', 'should handle empty strings');
  }());

  (function() {
    const tokenHighlighter = TokenHighlighter();
    const tokens = ['foo'];
    const text = 'bar baz';
    assert.is(tokenHighlighter(text, tokens), text, 'should not highlight strings without matches');
  }());

  (function() {
    const tokenHighlighter = TokenHighlighter();
    const tokens = ['foo'];
    const text = 'foo';
    assert.is(tokenHighlighter(text, tokens), wrapText(text), 'should highlight tokens that equal the full string');
  }());

  (function() {
    const tokenHighlighter = TokenHighlighter();
    const tokens = ['bar'];
    const text = 'foobar';
    assert.is(tokenHighlighter(text, tokens), text, 'should not highlight words ending with tokens');
  }());

  (function() {
    const tokenHighlighter = TokenHighlighter();
    const tokens = ['bar', 'baz'];
    const text = 'foo bar baz foo';
    const expectedText = `foo ${wrapText('bar')} ${wrapText('baz')} foo`;
    assert.is(tokenHighlighter(text, tokens), expectedText, 'should highlight multiple matches for multiple tokens');
  }());

  (function() {
    const tokenHighlighter = TokenHighlighter();
    const tokens = ['bar'];
    const text = 'foo bar';
    const expectedText = `foo ${wrapText('bar')}`;
    assert.is(tokenHighlighter(text, tokens), expectedText, 'should highlight the last word in the text');
  }());

  (function() {
    const tokenHighlighter = TokenHighlighter();
    const tokens = ['foo'];
    const text = 'foo bar';
    const expectedText = `${wrapText('foo')} bar`;
    assert.is(tokenHighlighter(text, tokens), expectedText, 'should highlight the first word in the text');
  }());

  (function() {
    const tokenHighlighter = TokenHighlighter();
    const tokens = ['foo', 'foobar'];
    const text = 'bar foobar baz';
    const expectedText = `bar ${wrapText(`${wrapText('foo')}bar`)} baz`;
    assert.is(tokenHighlighter(text, tokens), expectedText, 'should highlight tokens within tokens');
  }());

  (function() {
    const tokenHighlighter = TokenHighlighter();
    const tokens = ['foo', 'BAR'];
    const text = 'Foo bar baz';
    const expectedText = `${wrapText('Foo')} ${wrapText('bar')} baz`;
    assert.is(tokenHighlighter(text, tokens), expectedText, 'should highlight using sanitized text');
  }());

  (function() {
    const tokenHighlighter = TokenHighlighter();
    const tokens = ['foo', 'baz'];
    const text = '  foo bar baz ';
    const expectedText = `  ${wrapText('foo')} bar ${wrapText('baz')} `;
    assert.is(tokenHighlighter(text, tokens), expectedText, 'should highlight the correct words regardless of leading or trailing spaces');
  }());

  assert.end();
});