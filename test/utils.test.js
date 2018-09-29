const utils = require('../lib/utils');
const fs = require('fs');
const path = require('path');

const sign = {
  key: fs.readFileSync(
    path.resolve(__dirname, 'fixtures', 'sign', 'private.key'), {encoding: 'utf8'}
  ),
  certificate: fs.readFileSync(
    path.resolve(__dirname, 'fixtures', 'sign', 'server.pem'), {encoding: 'utf8'}
  ),
  secret: fs.readFileSync(
    path.resolve(__dirname, 'fixtures', 'sign', 'secret.txt'), {encoding: 'utf8'}
  )
};

describe('utils', () => {
  
  describe('urlSafe', () => {
    it('should replace chars', () => {
      expect(utils.urlSafe('1+2+3+4/5/6/7=')).to.equal('1-2-3-4_5_6_7');
    });
  });

  describe('getTimestamp', () => {
    it('should convert time to formatted string', () => {
      expect(utils.getTimestamp(1537788645624)).to.equal('2018.09.24 21:30:45 +1000');
    });
  });

  describe('encrypt', () => {
    it('should encrypt message', () => {
      expect(utils.encrypt('test123', sign.certificate, sign.key)).to.equal(sign.secret);
    });
  });

});
