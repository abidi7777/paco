const digitsRegex = /[0-9]*/;

const digits = () => (parserState) => {
  const {
    index,
    isError,
    target,
  } = parserState;

  if (isError) { return parserState; }

  const currTarget = target.slice(index);
  const [match] = currTarget.match(digitsRegex);

  if (match) {
    return Object.freeze({
      ...parserState,
      index: index + match.length,
      result: Number(match),
    });
  }

  return Object.freeze({
    ...parserState,
    isError: true,
    error: `digits: expected digits but found ${currTarget}`,
  });
};

export default digits;
