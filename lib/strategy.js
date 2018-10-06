const url = require('url');
const util = require('util');
const uuidv4 = require('uuid/v4');
const OAuth2Strategy = require('passport-oauth2');
const {urlSafe, encrypt, getTimestamp} = require('./utils');

/**
 * `Strategy` constructor.
 *
 * Options:
 *   - `clientID`
 *   - `certificate`
 *   - `key`
 *   - `password`
 *   - `scope`
 *   - `authorizationURL`
 *   - `callbackURL`
 *   - `tokenURL`
 *
 * @constructor
 * @param {Object} options
 * @param {Function} verify
 * @access public
 */
function EsiaStrategy(options, verify) {
  options = options || {};

  if (!options.key) { throw new TypeError('EsiaStrategy requires a key option'); }
  if (!options.certificate) { throw new TypeError('EsiaStrategy requires a certificate option'); }
  if (!options.callbackURL) { throw new TypeError('EsiaStrategy requires a callbackURL option'); }

  options.scope = options.scope || 'fullname email';
  options.authorizationURL = options.authorizationURL || 'https://esia-portal1.test.gosuslugi.ru/aas/oauth2/ac';
  options.tokenURL = options.tokenURL || 'https://esia-portal1.test.gosuslugi.ru/aas/oauth2/te';

  this._esia = {
    key: options.key,
    certificate: options.certificate
  };

  OAuth2Strategy.call(this, options, verify);
  this.name = 'esia';

};

// Inherit from `OAuth2Strategy`.
util.inherits(EsiaStrategy, OAuth2Strategy);

EsiaStrategy.prototype.authenticate = function (req, options) {
  options = options || {};
  if (!options.state) {
    options.state = uuidv4();
  }
  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

EsiaStrategy.prototype.userProfile = function(accessToken, done) {
  return done(null, {});
};

/**
 * Parameters to be included in the authorization request.
 *
 * @param {Object} options
 * @param {String} options.state
 * @return {Object}
 * @access protected
 */
EsiaStrategy.prototype.authorizationParams = function(options) {
  const timestamp = getTimestamp();
  const message = this._scope + timestamp + this._oauth2._clientId + options.state;
  const secret = encrypt(message, this._esia.certificate, this._esia.key);
  return {
    timestamp,
    access_type: options.accessType || 'online',
    client_secret: urlSafe(secret)
  };
};

/**
 * Parameters to be included in the authorization request.
 *
 * @param {Object} options
 * @param {String} options.state
 * @return {Object}
 * @access protected
 */
EsiaStrategy.prototype.tokenParams = function(options) {
  const timestamp = getTimestamp();
  const message = this._scope + timestamp + this._oauth2._clientId + options.state;
  const secret = encrypt(message, this._esia.certificate, this._esia.key);
  return {
    timestamp,
    state: options.state,
    token_type: 'Bearer',
    client_secret: urlSafe(secret)
  };
};

module.exports = EsiaStrategy;
