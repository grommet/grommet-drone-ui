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
  }

  watch(uri, onMessage) {
    this._ws = new WebSocket(`${this._options.url}${uri}`);
    this._ws.onopen = this._onOpen.bind(this);
    this._ws.onmessage = onMessage;
    this._ws.onclose = this._onClose.bind(this);

    return {
      close: () => {
        this._closed = true;
        this._ws.close();
      }
    };
  }

  _onOpen() {
    clearInterval(this._pollTimer);
  }

  _onClose() {
    this._ws = undefined;
    if (!this._closed) {
      // lost connection, retry in a bit
      this._pollTimer = setTimeout(
        this._initialize.bind(this), this._options.reconnectTimeout
      );
    }
  }
}
