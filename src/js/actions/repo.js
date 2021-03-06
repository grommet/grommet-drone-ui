import {
  REPO_ADD, REPO_FILTER, REPO_GET_ALL, REPO_GET_BUILDS, REPO_LOAD_BUILD_LOGS,
  REPO_LOAD_BUILD_LOG, REPO_NEW_BUILD_LOG, REPO_REMOVE, REPO_UPDATE,
  USER_LOAD_REPOS, REPO_SEARCH, REPO_SYNC
} from '../actions';
import { getUserRepos } from '../api/user';
import {
  add, getAll, getBuild, getBuilds, getLog, getRepo, remove, sync, update
} from '../api/repo';

import { watcher } from './utils';

const logStreamSocket = {};

export function addRepo(repo) {
  return (dispatch) => {
    add(repo)
      .then(
        (payload) => {
          dispatch({ type: REPO_ADD, payload });
          getUserRepos()
            .then(
              p => dispatch({ type: USER_LOAD_REPOS, payload: p }),
              p => dispatch({
                type: USER_LOAD_REPOS, error: true, payload: p.statusText
              })
            );
        },
        payload => dispatch(
          { type: REPO_ADD, error: true, payload: payload.statusText }
        )
      );
  };
}

export function filterRepos(filter) {
  return dispatch => dispatch({ type: REPO_FILTER, payload: filter });
}

export function getAllRepos() {
  return (dispatch) => {
    dispatch({ type: REPO_GET_ALL, loading: true });
    getAll()
      .then(
        payload => dispatch({ type: REPO_GET_ALL, payload }),
        payload => dispatch({
          type: REPO_GET_ALL, error: true, payload: payload.statusText
        })
      );
  };
}

export function loadBuilds(repoName) {
  return (dispatch) => {
    dispatch({ type: REPO_GET_BUILDS, loading: true });
    getRepo(repoName)
      .then(
        (repo) => {
          getBuilds(repoName)
            .then(
              payload => dispatch({
                type: REPO_GET_BUILDS,
                payload: {
                  ...repo,
                  status: payload && payload.length > 0 ?
                    payload[0].status : undefined,
                  builds: payload.reverse()
                }
              }),
              payload => dispatch(
                {
                  type: REPO_GET_BUILDS,
                  error: true,
                  payload: payload.statusText
                }
              )
            );
        },
        payload => dispatch(
          { type: REPO_GET_BUILDS, error: true, payload: payload.statusText }
        )
      );
  };
}

export function loadBuildLogs(repoName, number) {
  return (dispatch) => {
    dispatch({ type: REPO_LOAD_BUILD_LOGS, loading: true });
    getBuild(repoName, number)
      .then(
        (build) => {
          const jobPromises = [];
          build.jobs.forEach((job) => {
            if (job.status !== 'pending' && job.status !== 'running') {
              const jobPromise = getLog(repoName, number, job.number);
              jobPromises.push(jobPromise);
              jobPromise
                .then(
                  (log) => {
                    if (!build.logs) {
                      build.logs = {};
                    }
                    build.logs[job.number] = { job, log };
                  }
                );
            }
          });

          if (jobPromises.length === 0) {
            return dispatch(
              {
                type: REPO_LOAD_BUILD_LOGS,
                payload: build
              }
            );
          }
          return Promise.all(jobPromises).then(() => dispatch(
            {
              type: REPO_LOAD_BUILD_LOGS,
              payload: build
            }
          ));
        }
      )
      .catch(payload => dispatch(
        {
          type: REPO_LOAD_BUILD_LOGS,
          error: true,
          payload: payload.statusText
        }
      ));
  };
}

export function loadBuildLog(repoName, number, job) {
  return (dispatch) => {
    dispatch({ type: REPO_LOAD_BUILD_LOG, loading: true });
    getBuild(repoName, number)
      .then(
        (build) => {
          let isJobRunningOrPending = false;
          build.jobs.some((j) => {
            if (j.number.toString() === job) {
              isJobRunningOrPending = (
                j.status === 'running' || j.status === 'pending'
              );
              return true;
            }
            return false;
          });
          if (!isJobRunningOrPending) {
            getLog(repoName, number, job)
              .then(
                (log) => {
                  build.log = log;
                  dispatch(
                    {
                      type: REPO_LOAD_BUILD_LOG,
                      repoName,
                      payload: build
                    }
                  );
                }
              );
          } else {
            dispatch(
              {
                type: REPO_LOAD_BUILD_LOG,
                repoName,
                payload: build
              }
            );
          }
        }
      )
      .catch(payload => dispatch(
        {
          type: REPO_LOAD_BUILD_LOG,
          error: true,
          payload: payload.statusText
        }
      ));
  };
}

export function removeRepo(repo) {
  return (dispatch) => {
    remove(repo)
      .then(
        () => {
          dispatch({ type: REPO_REMOVE, payload: repo });
          getUserRepos()
            .then(
              payload => dispatch({ type: USER_LOAD_REPOS, payload }),
              payload => dispatch({
                type: USER_LOAD_REPOS, error: true, payload: payload.statusText
              })
            );
        },
        payload => dispatch(
          { type: REPO_REMOVE, error: true, payload: payload.statusText }
        )
      );
  };
}

export function searchRepos(searchText) {
  return dispatch => dispatch({ type: REPO_SEARCH, payload: searchText });
}

export function startLogStream(repoName, build, job) {
  return (dispatch) => {
    if (!logStreamSocket[build.number]) {
      logStreamSocket[build.number] = {};
    }
    const buildSockets = logStreamSocket[build.number];
    if (!buildSockets[job.number]) {
      // only start socket connections if there is a new job to add
      const socketUrl = `/ws/logs/${repoName}/${build.number}/${job.number}`;
      buildSockets[job.number] = watcher.watch(socketUrl, (message) => {
        const logMessage = JSON.parse(message.data);
        if (logMessage && logMessage.proc && logMessage.out) {
          dispatch({ type: REPO_NEW_BUILD_LOG, payload: logMessage });
        }
      });
    }
  };
}

export function stopLogStream(build, job) {
  const buildSockets = logStreamSocket[build.number];
  if (buildSockets && buildSockets[job.number]) {
    buildSockets[job.number].close();
    buildSockets[job.number] = undefined;
  }
}

export function syncRepos() {
  return (dispatch) => {
    sync()
      .then(
        (payload) => {
          dispatch({ type: REPO_SYNC, success: true });
          dispatch({ type: REPO_GET_ALL, payload });
        },
        payload => dispatch({
          type: REPO_GET_ALL, error: true, payload: payload.statusText
        })
      );
  };
}

export function updateRepo(repoName, data) {
  return (dispatch) => {
    dispatch({ type: REPO_UPDATE, loading: true });
    update(repoName, data)
      .then(
        () => dispatch({
          type: REPO_UPDATE, success: true, repoName
        }),
        payload => dispatch({
          type: REPO_UPDATE, error: true, payload: payload.statusText
        })
      );
  };
}

export default {
  addRepo, filterRepos, getAllRepos, loadBuilds, loadBuildLogs, loadBuildLog,
  removeRepo, searchRepos, startLogStream, stopLogStream, syncRepos, updateRepo
};
