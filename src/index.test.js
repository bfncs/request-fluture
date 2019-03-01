'use strict';

const requestFluture = require('./index');

const URL = 'http://non-existing.foo.bar';

const unexpectedAbort = () => {
  throw new Error('Unexpected abort of mock request');
};

const TIMEOUT = 1000;
const createMockRequest = (
  response,
  error = null,
  timeout = TIMEOUT,
  abort = unexpectedAbort
) =>
  jest.fn((options, cb) => {
    setTimeout(() => {
      cb(error, response);
    }, timeout);
    return { abort };
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

it('should abort underlying requests on cancellation', done => {
  expect.assertions(3);
  const successHandler = jest.fn();
  const errorHandler = jest.fn();
  const abortHandler = jest.fn();
  const cancelableRequest = createMockRequest(
    PAYLOAD,
    null,
    TIMEOUT,
    abortHandler
  );

  const f = requestFluture(URL, cancelableRequest);
  const cancel = f.fork(errorHandler, successHandler);

  setTimeout(() => {
    cancel();
    expect(abortHandler).toHaveBeenCalled();
    expect(errorHandler).not.toHaveBeenCalled();
    expect(successHandler).not.toHaveBeenCalled();
    done();
  }, 10);
  jest.runAllTimers();
});
