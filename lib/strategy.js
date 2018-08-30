const url = require('url');
const OAuth2Strategy = require('passport-oauth2');

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

module.exports = Strategy;
