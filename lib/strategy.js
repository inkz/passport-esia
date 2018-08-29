const OAuth2Strategy = require('passport-oauth2');

/**
 * `Strategy` constructor.
 *
 * Options:
 *   - `mnemonics`
 *   - `certificate`
 *   - `key`
 *   - `password`
 *   - `scope`
 *   - `portalURL`
 *   - `callbackURL`
 *
 * @constructor
 * @param {Object} options
 * @param {Function} verify
 * @access public
 */
function Strategy(options, verify) {

  options = options || {};
  options.scope = options.scope || 'fullname email';
  options.portalURL = options.portalURL || 'https://esia-portal1.test.gosuslugi.ru/';

  this.tokenURL = 'aas/oauth2/te';
  this.codeURL = 'aas/oauth2/ac';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'esia';

};

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

module.exports = Strategy;
