import { headers } from './utils';

export function getUser() {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'include'
  };

  return fetch('/api/user', options);
}

export default { getUser };
