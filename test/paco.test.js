import Paco from '../src/paco';
import char from '../src/parsers/char';
import digits from '../src/parsers/digits';
import letters from '../src/parsers/letters';

QUnit.module('Paco');

QUnit.test('should throw error if transformer is not a function', function shouldThrowError(assert) {
  assert.expect(1);
  assert.throws(() => new Paco());
});

QUnit.test('should match the given char', function shouldMatchChar(assert) {
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

QUnit.test('should populate error if couldn\'t match with a parser', function shouldPopulateError(assert) {
  const charParser = new Paco(char('a'));

  assert.expect(1);
  assert.deepEqual(charParser.run('b'), {
    index: 0,
    result: null,
    isError: true,
    error: 'char: expected a but found b @ 0',
    target: 'b',
  });
});

QUnit.test('should transform the result', function shouldTransformResult(assert) {
  const charParser = new Paco(char('a')).map((value) => ({
    type: 'char',
    value,
  }));

  assert.expect(1);
  assert.deepEqual(charParser.run('a'), {
    index: 1,
    result: { type: 'char', value: 'a' },
    isError: false,
    error: null,
    target: 'a',
  });
});

QUnit.test('should transform the error', function shouldTransformError(assert) {
  const charParser = new Paco(char('b')).errorMap((value) => ({
    type: 'char_mismatch',
    value,
  }));

  assert.expect(1);
  assert.deepEqual(charParser.run('a'), {
    index: 0,
    result: null,
    isError: true,
    error: {
      type: 'char_mismatch',
      value: 'char: expected b but found a @ 0',
    },
    target: 'a',
  });
});

QUnit.test('should parse recursively unless error or end of input', function shouldParseRecursively(assert) {
  const charParser = Paco.many(new Paco(char('a')));

  assert.expect(1);
  assert.deepEqual(charParser.run('aaaaaa'), {
    index: 6,
    result: [
      'a',
      'a',
      'a',
      'a',
      'a',
      'a',
    ],
    isError: false,
    error: null,
    target: 'aaaaaa',
  });
});

QUnit.test('should parse sequentially unless error or end of input', function shouldParseSequentially(assert) {
  const charParser = Paco.sequence([new Paco(char('a')), new Paco(char('b'))]);

  assert.expect(1);
  assert.deepEqual(charParser.run('ab'), {
    index: 2,
    result: [
      'a',
      'b',
    ],
    isError: false,
    error: null,
    target: 'ab',
  });
});

QUnit.test('should match any given parsers', function matchAnyGivenParser(assert) {
  const charParser = Paco.choice([new Paco(char('a')), new Paco(char('b'))]);

  assert.expect(1);
  assert.deepEqual(charParser.run('ab'), {
    index: 1,
    result: 'a',
    isError: false,
    error: null,
    target: 'ab',
  });
});

QUnit.test('should match string between curly brackets', function matchBetweenCurlyBrackets(assert) {
  const openCurlyBrackets = Paco.sequence([new Paco(char('{')), new Paco(char('{'))]);
  const closeCurlyBrackets = Paco.sequence([new Paco(char('}')), new Paco(char('}'))]);
  const betweenCurlyBrackets = Paco.between(openCurlyBrackets, closeCurlyBrackets);
  const extractKey = betweenCurlyBrackets(new Paco(letters()));

  assert.expect(1);
  assert.deepEqual(extractKey.run('{{name}}'), {
    index: 8,
    result: 'name',
    isError: false,
    error: null,
    target: '{{name}}',
  });
});

QUnit.test('should return the appropriate parser', function shouldReturnAppropriateParser(assert) {
  const getParserForType = (type) => {
    if (type === 'string') {
      return new Paco(letters());
    }

    return new Paco(digits());
  };
  const parseType = Paco.sequence([new Paco(letters()), new Paco(char(':'))])
    .map((res) => res[0])
    .chain(getParserForType);

  assert.expect(2);
  assert.deepEqual(parseType.run('string:name'), {
    index: 11,
    result: 'name',
    isError: false,
    error: null,
    target: 'string:name',
  });
  assert.deepEqual(parseType.run('number:1234'), {
    index: 11,
    result: 1234,
    isError: false,
    error: null,
    target: 'number:1234',
  });
});
