'use strict';

const Future = require('fluture');
const stealthyRequire = require('stealthy-require');

const request = stealthyRequire(
  require.cache,
  () => require('request'),
  () => require('tough-cookie'),
  module
);

const requestFluture = (options, requestProvider = request) =>
  Future.node(done => {
    const requestInstance = requestProvider(options, done);
    return () => requestInstance.abort();
  });

module.exports = requestFluture;
