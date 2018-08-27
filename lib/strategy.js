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

};

module.exports = Strategy;
