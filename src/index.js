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
  Future((reject, resolve) => {
    const nodeback = (err, res) => (err ? reject(err) : resolve(res));
    const requestInstance = requestProvider(options, nodeback);
    return () => requestInstance.abort();
  });

module.exports = requestFluture;
