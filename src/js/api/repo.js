import { headers, parseJSON, processResponse } from './utils';

export function add(repo) {
  const options = {
    headers: headers(),
    method: 'POST',
    credentials: 'include'
  };

  return fetch(`/api/repos/${repo.owner}/${repo.name}`, options)
    .then(parseJSON);
}

export function getAll() {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'include'
  };

  return fetch('/api/user/repos?all=true', options).then(parseJSON);
}

export function getRepo(repoName) {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'include'
  };

  return fetch(`/api/repos/${repoName}`, options).then(parseJSON);
}

export function getBuilds(repoName) {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'include'
  };

  return fetch(`/api/repos/${repoName}/builds`, options).then(parseJSON);
}

export function remove(repo) {
  const options = {
    headers: headers(),
    method: 'DELETE',
    credentials: 'include'
  };

  return fetch(`/api/repos/${repo.owner}/${repo.name}`, options)
    .then(processResponse);
}

export default { add, getAll, getBuilds, remove };
