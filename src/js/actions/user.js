import {
  USER_LOAD_REPOS, USER_UPDATE_REPO, REPO_NEW_BUILD, REPO_NEW_BUILD_STATUS
} from '../actions';
import { getUserRepos } from '../api/user';

import { watcher } from './utils';

let watchRepo;

export function loadUserRepos() {
  return (dispatch) => {
    dispatch({ type: USER_LOAD_REPOS, loading: true });
    getUserRepos()
      .then(
        payload => dispatch({ type: USER_LOAD_REPOS, payload }),
        payload => dispatch({ type: USER_LOAD_REPOS, error: true, payload })
      );
  };
}

export function startUserReposStream() {
  return (dispatch) => {
    if (!watchRepo) {
      watchRepo = watcher.watch('/ws/feed', (message) => {
        const { repo, build } = JSON.parse(message.data);

        // using the build status as the websocket does not return status for repo
        repo.status = build.status;

        dispatch({
          type: REPO_NEW_BUILD, repoName: repo.full_name, payload: build
        });

        dispatch({
          type: REPO_NEW_BUILD_STATUS, repoName: repo.full_name, payload: build
        });

        // notify User list about the build
        // this is useful for reflecting the changes in the nav bar
        dispatch({ type: USER_UPDATE_REPO, payload: repo });
      });
    }
  };
}

export default { loadUserRepos, startUserReposStream };
