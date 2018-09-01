const url = require('url');
const util = require('util');
const moment = require('moment');
const OAuth2Strategy = require('passport-oauth2');
const {urlSafe, encrypt} = require('./utils');

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
function Strategy(options, verify) {

  options = options || {};
  options.scope = options.scope || 'fullname email';
  options.authorizationURL = options.authorizationURL || 'https://esia-portal1.test.gosuslugi.ru/';
  options.tokenURL = url.resolve(options.authorizationURL, 'aas/oauth2/te');
  options.codeURL = url.resolve(options.authorizationURL, 'aas/oauth2/ac');

  OAuth2Strategy.call(this, options, verify);
  this.name = 'esia';

};

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

/**
 * Parameters to be included in the authorization request.
 *
 * @param {Object} options
 * @return {Object}
 * @access protected
 */
Strategy.prototype.authorizationParams = function(options) {
  const timestamp = moment().format('YYYY.MM.DD HH:mm:ss ZZ');
  const message = options.scope + timestamp + options.clientID + options.state;
  const secret = encrypt(message, options.certificate, options.key);
  return {
    timestamp,
    client_secret: urlSafe(secret),
    access_type: 'online'
  };
};

module.exports = Strategy;
