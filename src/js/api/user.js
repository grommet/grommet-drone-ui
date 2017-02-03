import { headers, parseJSON } from './utils';

export function getUserRepos() {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'include'
  };

  return fetch('/api/user/feed?latest=true', options).then(parseJSON);
}

export default { getUserRepos };
