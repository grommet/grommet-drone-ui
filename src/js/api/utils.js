let _headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

export function headers() {
  return _headers;
}

export function parseJSON(response) {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(response);
}

export function processResponse(response) {
  if (response.ok) {
    return Promise.resolve();
  }
  return Promise.reject(response);
}

export function updateHeaders(newHeaders) {
  _headers = { ..._headers, ...newHeaders };
  Object.keys(_headers).forEach((key) => {
    if (undefined === _headers[key]) {
      delete _headers[key];
    }
  });
}
