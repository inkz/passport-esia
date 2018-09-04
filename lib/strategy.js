const passport = require('passport-strategy');
const {OAuth2} = require('oauth');
const url = require('url');
const util = require('util');
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
  options.scope = options.scope || 'fullname email';
  options.authorizationURL = options.authorizationURL || 'https://esia-portal1.test.gosuslugi.ru/';
  options.tokenURL = url.resolve(options.authorizationURL, 'aas/oauth2/te');
  options.codeURL = url.resolve(options.authorizationURL, 'aas/oauth2/ac');

  passport.Strategy.call(this);
  this.name = 'esia';

  this._oauth2 = new OAuth2(
    options.clientID,
    options.clientSecret,
    '',
    options.authorizationURL,
    options.tokenURL,
    options.customHeaders
  );

};

// Inherit from `passport.Strategy`.
util.inherits(EsiaStrategy, passport.Strategy);

EsiaStrategy.prototype.authenticate = function(req, options) {
  const timestamp = getTimestamp();
  const message = options.scope + timestamp + options.clientID + options.state;
  const secret = encrypt(message, options.certificate, options.key);
  const params = {
    timestamp,
    client_secret: urlSafe(secret),
    access_type: 'online'
  };
};

module.exports = EsiaStrategy;
