const wsRegex = (
  /^(wss?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/i
);

export default class WSWatcher {
  constructor(options = {}) {
    this._options = Object.assign({
      reconnectTimeout: 5000, // 5s
    }, options);

    if (this._options.url) {
      if (!wsRegex.test(this._options.url)) {
        throw new Error('Option url is not a valid socket url');
      }
      if (!('WebSocket' in window || 'MozWebSocket' in window)) {
        throw new Error('WebSocket not available in this browser');
      }
    } else {
      throw new Error('Option url is required');
    }

    this._ws = {};
  }

  watch(uri, onMessage) {
    const socket = new WebSocket(`${this._options.url}${uri}`);
    socket.onopen = this._onOpen.bind(this);
    socket.onmessage = onMessage;
    socket.ondisconnect = this._onError.bind(this, uri);
    socket.onclose = this._onClose.bind(this, uri);

    this._ws[uri] = socket;

    return {
      close: () => {
        this._ws[uri]._closed = true;
        this._ws[uri].close();
      }
    };
  }

  _onError(uri) {
    if (this._ws[uri]) {
      this._ws[uri]._errored = true;
    }
  }

  _onOpen() {
    clearInterval(this._pollTimer);
  }

  _onClose(uri) {
    if (this._ws[uri]) {
      const watch = this.watch;
      const onMessage = this._ws[uri].onmessage;
      const errored = this._ws[uri]._errored;

      this._ws[uri] = undefined;
      if (errored) {
        // lost connection, retry in a bit
        this._pollTimer = setTimeout(
          watch.bind(this, uri, onMessage),
          this._options.reconnectTimeout
        );
      }
    }
  }
}
