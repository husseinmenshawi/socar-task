'use strict';

module.exports = {
  passport: {
    jwtToken: require('./passport-jwt'),
  },
  jtwTokenValidator: require('./jwt-token-validator'),
};
