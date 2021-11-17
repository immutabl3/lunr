import test from 'tape';
import sanitize from '../src/Sanitizer/lowerCaseSanitizer.js';

test('lowerCaseSanitizer', function(assert) {
  assert.is(sanitize(null), '', 'should handle falsy values');
  assert.is(sanitize(undefined), '', 'should handle falsy values');
  assert.is(sanitize(false), '', 'should handle falsy values');
  assert.is(sanitize(''), '', 'should handle empty strings');
  assert.is(sanitize('  '), '', 'should handle whitespace-only strings');
  assert.is(sanitize(' a'), 'a', 'should handle leading whitespace');
  assert.is(sanitize('b '), 'b', 'should handle trailing whitespace');
  assert.is(sanitize(' c '), 'c', 'should handle leading and trailing whitespace');
  assert.is(sanitize('AbC'), 'abc', 'should convert uppercase to lower case');
  assert.end();
});