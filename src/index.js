'use strict';

const Future = require('fluture');
const request = require('request');

const requestFluture = (options, requestProvider = request) =>
  Future((reject, resolve) => {
    const nodeback = (err, res) => (err ? reject(err) : resolve(res));
    const requestInstance = requestProvider(options, nodeback);
    return () => requestInstance.abort();
  });

module.exports = requestFluture;
