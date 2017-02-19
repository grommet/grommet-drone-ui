import { USER_LOAD_REPOS, USER_UPDATE_REPO } from '../actions';
import { createReducer } from './utils';

const initialState = {
  repos: undefined
};

const handlers = {
  [USER_LOAD_REPOS]: (state, action) => {
    if (!action.error && !action.loading) {
      return {
        error: undefined,
        loading: false,
        repos: action.payload.sort(
          (a, b) => (b.started_at || b.created_at || -1) -
            (a.started_at || a.created_at || -1)
        )
      };
    }
    if (action.loading) {
      return {
        loading: true,
        error: undefined
      };
    }
    return { error: action.payload, loading: false };
  },
  [USER_UPDATE_REPO]: (state, action) => {
    const updateRepos = (state.repos || []).map((repo) => {
      if (repo.full_name === action.payload.full_name) {
        return action.payload;
      }
      return repo;
    });

    return {
      repos: updateRepos
    };
  }
};

export default createReducer(initialState, handlers);
