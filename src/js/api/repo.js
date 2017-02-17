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

export function getBuild(repoName, number) {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'include'
  };

  return fetch(
    `/api/repos/${repoName}/builds/${number}`, options
  ).then(parseJSON);
}

export function getLog(repoName, number, job) {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'include'
  };

  return fetch(
    `/api/repos/${repoName}/logs/${number}/${job}`, options
  ).then(parseJSON).then((lines) => {
    const log = {};

    // this code groups the lines of output by process.
    lines.forEach((line) => {
      if (!line || !line.proc || !line.out) return;
      let proc = log[line.proc];
      if (!proc) {
        proc = [];
        log[line.proc] = proc;
      }
      proc.push(line);
    });

    return Promise.resolve(log);
  });
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

export function restart(repoName, number) {
  const options = {
    headers: headers(),
    method: 'POST',
    credentials: 'include'
  };

  return fetch(`/api/repos/${repoName}/builds/${number}`, options)
    .then(processResponse);
}

export function sync() {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'include'
  };

  return fetch('/api/user/repos?all=true&flush=true', options).then(parseJSON);
}

export function update(repoName, data) {
  // there is a bug where the input parameter names differ from
  // the output parameter names. This attempts to resolve.
  if (data.allow_deploys) {
    data.allow_deploy = data.allow_deploys;
  }
  if (data.allow_tags) {
    data.allow_tag = data.allow_tags;
  }

  const options = {
    headers: headers(),
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify(data)
  };

  return fetch(`/api/repos/${repoName}`, options)
    .then(processResponse);
}

export default {
  add, getAll, getBuilds, getBuild, getLog, remove, sync, update
};
