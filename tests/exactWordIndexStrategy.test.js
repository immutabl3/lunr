import test from 'tape';
import indexStrategy from '../src/IndexStrategy/exactWordIndexStrategy.js';

test('exactWordIndexStrategy', function(assert) {
  assert.is(indexStrategy('').length, 0, 'should not expand empty tokens');
  
  const expandedTokens = indexStrategy('cat');
  assert.is(expandedTokens.length, 1, 'should not expand tokens');
  assert.ok(expandedTokens.includes('cat'), 'should not expand tokens');
  
  assert.end();
});