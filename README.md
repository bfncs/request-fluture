# request-fluture
[![Build Status](https://travis-ci.org/bfncs/request-fluture.svg?branch=master)](https://travis-ci.org/bfncs/request-fluture)

Simple HTTP requests with [Flutures](https://github.com/fluture-js/Fluture) and [request](https://github.com/request/request).

This is a wrapper around `request` to offer a Fluture API (instead of callback- or promise-driven).


## Install

```bash
# If you are using npm
npm install request-fluture

# If you are using yarn
yarn add request-fluture
```


## Usage

Call the exported function with either a `url` or an `options` object [according to the `request` docs](https://github.com/request/request#requestoptions-callback).
It returns a `Fluture` for your pending request. You can use the whole [`Fluture API`](https://github.com/fluture-js/Fluture#documentation) to work further with it.

```js
const request = require('request-fluture');

request('http://example.com')
    .fork(
       error => console.error('Oh no!', error),
       response => console.log('Got a response!', response)
     );
```


## Examples

### Parallel requests

Execute five requests with maximum `5` requests in parallel.

```js
const Future = require('fluture');
const request = require('request-fluture');

const tenRequests = Array.from(Array(10).keys())
  .map(resource => request(`http://example.com/${resource}`));

Future.parallel(5, tenRequests)
  .fork(
    console.error,
    results => { results.forEach(console.log); }
  );
```


## Prior art

This is just a slight extension of a [Gist](https://gist.github.com/Avaq/e7083ffc7972bb1d4c88239b51eb4a79) by @Avaq.