import {
  REPO_ADD, REPO_GET_ALL, REPO_GET_BUILDS, REPO_REMOVE, USER_LOAD_REPOS
} from '../actions';
import { getUserRepos } from '../api/user';
import { add, getAll, getBuilds, getRepo, remove } from '../api/repo';

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

export default { addRepo, getAllRepos, loadBuilds, removeRepo };
