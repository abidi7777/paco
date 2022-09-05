const char = (c) => (parserState) => {
  const {
    index,
    isError,
    target,
  } = parserState;

  if (isError) { return parserState; }
  if (c === target[index]) {
    return Object.freeze({
      ...parserState,
      index: index + 1,
      result: c,
    });
  }

  return Object.freeze({
    ...parserState,
    isError: true,
    error: `char: expected ${c} but found ${target[index]} @ ${index}`,
  });
};

export default char;
