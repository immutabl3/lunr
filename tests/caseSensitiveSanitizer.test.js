import test from 'tape';
import sanitize from '../src/Sanitizer/caseSensitiveSanitizer.js';

test('caseSensitiveSanitizer', function(assert) {
  assert.is(sanitize(null), '', 'should handle falsy values');
  assert.is(sanitize(undefined), '', 'should handle falsy values');
  assert.is(sanitize(false), '', 'should handle falsy values');
  assert.is(sanitize(''), '', 'should handle empty strings');
  assert.is(sanitize('  '), '', 'should handle whitespace-only strings');
  assert.is(sanitize(' a'), 'a', 'should handle leading');
  assert.is(sanitize('b '), 'b', 'should handle trailing whitespace');
  assert.is(sanitize(' c '), 'c', 'should handle leading and trailing whitespace');
  assert.is(sanitize('AbC'), 'AbC', 'should not modify case');
  assert.end();
});