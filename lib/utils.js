exports.urlSafe = (str) =>
  str.trim()
    .split('+')
    .join('-')
    .split('/')
    .join('_')
    .replace('=', '');

exports.encrypt = (message, certificate, key) => {
  return message;
};
