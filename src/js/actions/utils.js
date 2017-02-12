import WSWatcher from '../api/WSWatcher';

const proto = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';

export const watcher = new WSWatcher({
  url: `${proto}//${window.location.host}`
});

export default { watcher };
