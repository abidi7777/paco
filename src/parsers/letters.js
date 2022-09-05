const lettersRegex = /[a-zA-Z]*/;

const letters = () => (parserState) => {
  const {
    index,
    isError,
    target,
  } = parserState;

  if (isError) { return parserState; }

  const currTarget = target.slice(index);
  const [match] = currTarget.match(lettersRegex);

  if (match) {
    return Object.freeze({
      ...parserState,
      index: index + match.length,
      result: match,
    });
  }

  return Object.freeze({
    ...parserState,
    isError: true,
    error: `letters: expected letters but found ${currTarget}`,
  });
};

export default letters;
