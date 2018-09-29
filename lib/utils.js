const forge = require('node-forge');

exports.urlSafe = (str) =>
  str.trim()
    .split('+')
    .join('-')
    .split('/')
    .join('_')
    .replace('=', '');

exports.getTimestamp = (value) => {
  const now = value ? new Date(value) : new Date();
  const dateFormat = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const [date, time] = now.toLocaleString('en', dateFormat).split(', ');
  const [month, day, year] = date.split('/');
  const [hour, min, sec] = time.split(':');
  const tz = now.toString().match(/GMT[\+|\-](\d*)/)[1];
  return `${year}.${month}.${day} ${hour}:${min}:${sec} +${tz}`;
};

exports.encrypt = (message, certificate, key) => {
  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(message, 'utf8');
  p7.addCertificate(certificate);
  p7.addSigner({
    key,
    certificate,
    digestAlgorithm: forge.pki.oids.sha256
  });
  p7.sign();
  const pem = forge.pkcs7.messageToPem(p7);
  const secret = pem.split('\r\n').slice(1, -2).join('');
  return secret;
};
