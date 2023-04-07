function devLog(input) {
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log(input);
  }
}

export default devLog;
