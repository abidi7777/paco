import Paco from '../src/paco';
import char from '../src/parsers/char';

QUnit.module('Paco');

QUnit.test('should match a char', function shouldMatchChar(assert) {
  const charParser = new Paco(char('a'));

  assert.expect(1);
  assert.deepEqual(charParser.run('a'), {
    index: 1,
    result: 'a',
    isError: false,
    error: null,
    target: 'a',
  });
});

QUnit.test('should populate error when not char', function shouldPopulateError(assert) {
  const charParser = new Paco(char());

  assert.expect(1);
  assert.deepEqual(charParser.run('b'), {
    index: 0,
    result: null,
    isError: true,
    error: 'char: expected undefined but found b @ 0',
    target: 'b',
  });
});
