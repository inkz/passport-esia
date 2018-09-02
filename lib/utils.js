const forge = require('node-forge');

exports.urlSafe = (str) =>
  str.trim()
    .split('+')
    .join('-')
    .split('/')
    .join('_')
    .replace('=', '');

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
