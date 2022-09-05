/* eslint-disable no-restricted-syntax */

class Paco {
  constructor(transformer) {
    if (typeof transformer !== 'function') {
      throw new TypeError('transformer must be a function');
    }

    this.transformer = transformer;
  }

  run(target) {
    const initialState = Object.freeze({
      index: 0,
      result: null,
      isError: false,
      error: null,
      target,
    });

    return this.transformer(initialState);
  }

  chain(cb) {
    return new Paco((parserState) => {
      const nextState = this.transformer(parserState);

      if (nextState.isError) { return nextState; }

      const nextParser = cb(nextState.result);

      return nextParser.transformer(nextState);
    });
  }

  map(cb) {
    return new Paco((parserState) => {
      const nextState = this.transformer(parserState);

      if (nextState.isError) { return nextState; }

      return Object.freeze({
        ...nextState,
        result: cb(nextState.result),
      });
    });
  }

  errorMap(cb) {
    return new Paco((parserState) => {
      const nextState = this.transformer(parserState);

      if (!nextState.isError) { return nextState; }

      return Object.freeze({
        ...nextState,
        error: cb(nextState.error),
      });
    });
  }

  static many(parser) {
    return new Paco((parserState) => {
      const { isError } = parserState;

      if (isError) { return parserState; }

      const results = [];
      let prevState = parserState;
      let nextState = parserState;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        nextState = parser.transformer(nextState);

        if (nextState.isError) { break; }

        prevState = nextState;

        results.push(prevState.result);
      }

      return Object.freeze({
        ...prevState,
        result: results,
      });
    });
  }

  static sequence(parsers) {
    return new Paco((parserState) => {
      const { isError } = parserState;

      if (isError) { return parserState; }

      const results = [];
      let nextState = parserState;

      for (const parser of parsers) {
        nextState = parser.transformer(nextState);

        if (nextState.isError) { break; }

        results.push(nextState.result);
      }

      return Object.freeze({
        ...nextState,
        result: results,
      });
    });
  }

  static choice(parsers) {
    return new Paco((parserState) => {
      const {
        index,
        isError,
      } = parserState;

      if (isError) { return parserState; }

      for (const parser of parsers) {
        const nextState = parser.transformer(parserState);

        if (!nextState.isError) { return nextState; }
      }

      return Object.freeze({
        ...parserState,
        isError: true,
        error: `choice: couldn't match with any of the given parsers @ ${index}`,
      });
    });
  }

  static between(leftParser, rightParser) {
    return (contentParser) => Paco.sequence([leftParser, contentParser, rightParser]);
  }
}

if (typeof window !== 'undefined') {
  window.Paco = Paco;
}

export default Paco;
