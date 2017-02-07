import {
  REPO_ADD, REPO_CLEAR_MESSAGE, REPO_GET_ALL, REPO_GET_BUILDS,
  REPO_NEW_BUILD, REPO_REMOVE
} from '../actions';
import { createReducer } from './utils';

const initialState = {
  allRepos: []
};

const handlers = {
  [REPO_ADD]: (state, action) => {
    if (!action.error) {
      const allRepos = state.allRepos.map((repo) => {
        if (repo.full_name === action.payload.full_name) {
          return action.payload;
        }
        return repo;
      });
      return {
        success: `Successfully added ${action.payload.full_name}`,
        allRepos
      };
    }
    return { error: action.payload, success: undefined };
  },
  [REPO_CLEAR_MESSAGE]: () => ({ error: undefined, success: undefined }),
  [REPO_GET_ALL]: (state, action) => {
    if (!action.error && !action.loading) {
      return {
        loading: false,
        allRepos: action.payload.sort(
          (a, b) => {
            if (a.full_name < b.full_name) return -1;
            if (a.full_name > b.full_name) return 1;
            return 0;
          }
        )
      };
    }
    if (action.loading) {
      return {
        loading: true
      };
    }
    return { error: action.payload, loading: false };
  },
  [REPO_GET_BUILDS]: (state, action) => {
    if (!action.error && !action.loading) {
      return { loading: false, repoWithBuilds: action.payload };
    }
    if (action.loading) {
      return {
        loading: true, repoWithBuilds: undefined
      };
    }
    return { error: action.payload, loading: false, repoWithBuilds: undefined };
  },
  [REPO_NEW_BUILD]: (state, action) => {
    const repo = state.repoWithBuilds;
    if (repo && repo.full_name === action.repoName) {
      const repoWithBuilds = { ...state.repoWithBuilds };
      repoWithBuilds.status = action.payload.status;
      if (!repoWithBuilds.builds) {
        repoWithBuilds.builds = [];
      }

      let lastBuild;
      if (repoWithBuilds.builds.length > 0) {
        lastBuild = (
          repoWithBuilds.builds[repoWithBuilds.builds.length - 1]
        );
      }

      if (lastBuild && lastBuild.number === action.payload.number) {
        repoWithBuilds.builds[
          repoWithBuilds.builds.length - 1
        ] = action.payload;
      } else {
        repoWithBuilds.builds.push(action.payload);
      }

      return {
        repoWithBuilds
      };
    }
    return undefined;
  },
  [REPO_REMOVE]: (state, action) => {
    if (!action.error) {
      const allRepos = state.allRepos.map((repo) => {
        if (repo.full_name === action.payload.full_name) {
          delete repo.id;
        }
        return repo;
      });
      return {
        success: `Successfully removed ${action.payload.full_name}`,
        allRepos
      };
    }
    return { error: action.payload, success: undefined };
  }
};

export default createReducer(initialState, handlers);
