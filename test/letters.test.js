import Paco from '../src/paco';
import letters from '../src/parsers/letters';

QUnit.module('Paco');

QUnit.test('should match the letters', function shouldMatchLetters(assert) {
  const charParser = new Paco(letters());

  assert.expect(1);
  assert.deepEqual(charParser.run('abcd'), {
    index: 4,
    result: 'abcd',
    isError: false,
    error: null,
    target: 'abcd',
  });
});

QUnit.test('should populate error when not letters', function shouldPopulateError(assert) {
  const charParser = new Paco(letters());

  assert.expect(1);
  assert.deepEqual(charParser.run('1234'), {
    index: 0,
    result: null,
    isError: true,
    error: 'letters: expected letters but found 1234',
    target: '1234',
  });
});
