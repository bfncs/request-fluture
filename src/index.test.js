'use strict';

const requestFluture = require('./index');

const URL = 'http://non-existing.foo.bar';

const TIMEOUT = 1000;
const createMockRequest = (response, error = null, timeout = TIMEOUT) =>
  jest.fn((options, cb) => {
    setTimeout(() => {
      cb(error, response);
    }, timeout);
  });

const PAYLOAD = Symbol();
const REQUEST_SUCCESS = createMockRequest(PAYLOAD);
const ERROR = new Error('Failure');
const REQUEST_FAILURE = createMockRequest(null, ERROR);

jest.useFakeTimers();

it('resolves successful requests', done => {
  expect.assertions(1);

  requestFluture(URL, REQUEST_SUCCESS).value(res => {
    expect(res).toEqual(PAYLOAD);
    done();
  });
  jest.runAllTimers();
});

it('fails erronous requests', done => {
  expect.assertions(2);
  const successHandler = jest.fn();

  requestFluture(URL, REQUEST_FAILURE).fork(error => {
    expect(error).toEqual(ERROR);
    expect(successHandler).not.toHaveBeenCalled();
    done();
  }, successHandler);
  jest.runAllTimers();
});
