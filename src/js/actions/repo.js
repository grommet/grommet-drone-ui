import {
  REPO_ADD, REPO_GET_ALL, REPO_GET_BUILDS, REPO_LOAD_BUILD_LOGS,
  REPO_LOAD_BUILD_LOG, REPO_REMOVE, USER_LOAD_REPOS
} from '../actions';
import { getUserRepos } from '../api/user';
import {
  add, getAll, getBuild, getBuilds, getLog, getRepo, remove
} from '../api/repo';

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
                type: USER_LOAD_REPOS, error: true, payload: p
              })
            );
        },
        payload => dispatch(
          { type: REPO_ADD, error: true, payload: payload.statusText }
        )
      );
  };
}

export function getAllRepos() {
  return (dispatch) => {
    dispatch({ type: REPO_GET_ALL, loading: true });
    getAll()
      .then(
        payload => dispatch({ type: REPO_GET_ALL, payload }),
        payload => dispatch({ type: REPO_GET_ALL, error: true, payload })
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
          let isJobRunning = false;
          build.jobs.some((j) => {
            if (j.number.toString() === job) {
              isJobRunning = j.status === 'running' || j.status === 'pending';
              return true;
            }
            return false;
          });
          if (!isJobRunning) {
            getLog(repoName, number, job)
              .then(
                (log) => {
                  build.log = log;
                  dispatch(
                    {
                      type: REPO_LOAD_BUILD_LOG,
                      payload: build
                    }
                  );
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
                type: USER_LOAD_REPOS, error: true, payload
              })
            );
        },
        payload => dispatch(
          { type: REPO_REMOVE, error: true, payload: payload.statusText }
        )
      );
  };
}

export default {
  addRepo, getAllRepos, loadBuilds, loadBuildLogs, loadBuildLog, removeRepo
};
