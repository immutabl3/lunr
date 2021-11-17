import test from 'tape';
import indexStrategy from '../src/IndexStrategy/prefixIndexStrategy.js';

test('prefixIndexStrategy', function(assert) {
  assert.is(indexStrategy('').length, 0, 'should not expand empty tokens');
  assert.is(indexStrategy('a').length, 1, 'should not expand single character tokens');
  assert.ok(indexStrategy('a').includes('a'), 'should not expand single character tokens');
  
  const expandedTokens = indexStrategy('cat');
  assert.is(expandedTokens.length, 3, 'should expand multi-character tokens');
  assert.ok(expandedTokens.includes('c'), 'should expand multi-character tokens');
  assert.ok(expandedTokens.includes('ca'), 'should expand multi-character tokens');
  assert.ok(expandedTokens.includes('cat'), 'should expand multi-character tokens');

  assert.end();
});