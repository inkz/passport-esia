const forge = require('node-forge');

exports.urlSafe = (str) =>
  str.trim()
    .split('+')
    .join('-')
    .split('/')
    .join('_')
    .replace('=', '');

exports.getTimestamp = () => {
  const now = new Date();
  const year = now.toLocaleString('en', {year: 'numeric'});
  const month = now.toLocaleString('en', {month: '2-digit'});
  const day = now.toLocaleString('en', {day: '2-digit'});
  const hour = now.toLocaleString('en', {hour: '2-digit'});
  const min = now.toLocaleString('en', {minute: '2-digit'});
  const sec = now.toLocaleString('en', {second: '2-digit'});
  const tz = now.toString().match(/GMT\+|\-(\d*)/)[1];
  return `${year}.${month}.${day} ${hour}:${min}:${sec} +${tz}`;
}

exports.encrypt = (message, certificate, key) => {
  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(message, 'utf8');
  p7.addCertificate(certificate);
  p7.addSigner({
    key,
    certificate,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      {type: forge.pki.oids.contentType, value: forge.pki.oids.data},
      {type: forge.pki.oids.messageDigest},
      {type: forge.pki.oids.signingTime, value: new Date()}
    ]
  });
  p7.sign();
  const pem = forge.pkcs7.messageToPem(p7);
  const secret = pem.split('\r\n').slice(1, -2).join('');
  return secret;
};
