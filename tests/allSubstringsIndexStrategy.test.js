import test from 'tape';
import indexStrategy from '../src/IndexStrategy/allSubstringsIndexStrategy.js';

test('allSubstringsIndexStrategy', function(assert) {
  assert.is(indexStrategy('').length, 0, 'should not expand empty tokens');
  assert.is(indexStrategy('a').length, 1, 'should not expand single character tokens');
  assert.ok(indexStrategy('a').includes('a'), 'should not expand single character tokens');

  const expandedTokens = indexStrategy('cat');
  assert.is(expandedTokens.length, 6, 'should expand multi-character tokens');
  assert.ok(expandedTokens.includes('c'), 'should expand multi-character tokens');
  assert.ok(expandedTokens.includes('ca'), 'should expand multi-character tokens');
  assert.ok(expandedTokens.includes('cat'), 'should expand multi-character tokens');
  assert.ok(expandedTokens.includes('a'), 'should expand multi-character tokens');
  assert.ok(expandedTokens.includes('at'), 'should expand multi-character tokens');
  assert.ok(expandedTokens.includes('t'), 'should expand multi-character tokens');
  
  assert.end();
});