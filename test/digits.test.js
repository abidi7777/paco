import Paco from '../src/paco';
import digits from '../src/parsers/digits';

QUnit.module('Paco');

QUnit.test('should match the digits', function shouldMatchDigits(assert) {
  const charParser = new Paco(digits());

  assert.expect(1);
  assert.deepEqual(charParser.run('1234'), {
    index: 4,
    result: 1234,
    isError: false,
    error: null,
    target: '1234',
  });
});

QUnit.test('should populate error when not digits', function shouldPopulateError(assert) {
  const charParser = new Paco(digits());

  assert.expect(1);
  assert.deepEqual(charParser.run('abcd'), {
    index: 0,
    result: null,
    isError: true,
    error: 'digits: expected digits but found abcd',
    target: 'abcd',
  });
});
