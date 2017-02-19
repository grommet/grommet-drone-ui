import {
  REPO_ADD, REPO_FILTER, REPO_CLEAR_MESSAGE, REPO_GET_ALL, REPO_GET_BUILDS,
  REPO_LOAD_BUILD_LOGS, REPO_LOAD_BUILD_LOG, REPO_NEW_BUILD, REPO_NEW_BUILD_LOG,
  REPO_NEW_BUILD_STATUS, REPO_REMOVE, REPO_SEARCH, REPO_SYNC, REPO_UPDATE
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
        error: undefined,
        success: `Successfully added ${action.payload.full_name}`,
        allRepos
      };
    }
    return { error: action.payload, success: undefined };
  },
  [REPO_CLEAR_MESSAGE]: () => ({ error: undefined, success: undefined }),
  [REPO_FILTER]: (state, action) => {
    let originalRepos = state.originalRepos;
    if (!state.originalRepos) {
      originalRepos = [...state.allRepos];
    }

    let filteredRepos = [...originalRepos];

    // apply search first
    if (state.searchText && state.searchText !== '') {
      filteredRepos = filteredRepos.filter(repo => (
        repo.owner.toLowerCase().startsWith(state.searchText.toLowerCase()) ||
        repo.name.toLowerCase().startsWith(state.searchText.toLowerCase())
      ));
    }

    const currentFilter = {
      status: action.payload.status || state.filter.status,
      owner: action.payload.owner || state.filter.owner
    };

    if (currentFilter.status === 'active') {
      filteredRepos = filteredRepos.filter(repo => repo.id);
    } else if (currentFilter.status === 'inactive') {
      filteredRepos = filteredRepos.filter(repo => !repo.id);
    }

    if (currentFilter.owner !== 'all') {
      filteredRepos = filteredRepos.filter(
        repo => currentFilter.owner.indexOf(repo.owner) >= 0
      );
    }

    return {
      allRepos: filteredRepos,
      originalRepos,
      filter: Object.assign(state.filter, currentFilter, {
        filteredTotal: originalRepos.length !== filteredRepos.length ?
          filteredRepos.length : 0,
        unfilteredTotal: originalRepos.length
      })
    };
  },
  [REPO_GET_ALL]: (state, action) => {
    if (!action.error && !action.loading) {
      const allRepos = action.payload.sort(
        (a, b) => {
          if (a.full_name < b.full_name) return -1;
          if (a.full_name > b.full_name) return 1;
          return 0;
        }
      );

      const owners = [];
      allRepos.forEach((repo) => {
        if (owners.indexOf(repo.owner) < 0) {
          owners.push(repo.owner);
        }
      });

      return {
        loading: false,
        error: undefined,
        allRepos,
        filter: {
          status: 'all',
          owner: 'all',
          owners,
          filteredTotal: 0,
          unfilteredTotal: action.payload.length
        }
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
  [REPO_GET_BUILDS]: (state, action) => {
    if (!action.error && !action.loading) {
      return {
        loading: false, error: undefined, repoWithBuilds: action.payload
      };
    }
    if (action.loading) {
      return {
        loading: true, error: undefined, repoWithBuilds: undefined
      };
    }
    return { error: action.payload, loading: false, repoWithBuilds: undefined };
  },
  [REPO_LOAD_BUILD_LOGS]: (state, action) => {
    if (!action.error && !action.loading) {
      const build = action.payload;
      if (build.jobs.length === 1 && build.logs) {
        build.log = build.logs['1'].log;
      }
      return { loading: false, build, error: undefined };
    }
    if (action.loading) {
      return {
        loading: true, error: undefined, build: undefined
      };
    }
    return {
      error: action.payload, loading: false, build: undefined
    };
  },
  [REPO_LOAD_BUILD_LOG]: (state, action) => {
    if (!action.error && !action.loading) {
      return {
        loading: false, error: undefined, build: action.payload
      };
    }
    if (action.loading) {
      return {
        loading: true, error: undefined, build: undefined
      };
    }
    return {
      error: action.payload, loading: false, build: undefined
    };
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
  [REPO_NEW_BUILD_LOG]: (state, action) => {
    const build = { ...state.build };
    const logMessage = action.payload;
    if (!build.log) {
      build.log = {};
    }

    const log = build.log[logMessage.proc];
    if (!log) {
      build.log[logMessage.proc] = [logMessage];
    } else {
      build.log[logMessage.proc].push(logMessage);
    }

    return { build };
  },
  [REPO_NEW_BUILD_STATUS]: (state, action) => {
    if (state.build && state.build.number === action.payload.number) {
      const build = { ...state.build };
      build.status = action.payload.status;

      return {
        build
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
  },
  [REPO_SEARCH]: (state, action) => {
    let originalRepos = state.originalRepos;
    if (action.payload !== '' && !state.originalRepos) {
      originalRepos = [...state.allRepos];
    } else if (action.payload === '') {
      return { allRepos: state.originalRepos, originalRepos: undefined };
    }

    const allRepos = state.allRepos.filter(repo => (
      repo.owner.toLowerCase().startsWith(action.payload.toLowerCase()) ||
      repo.name.toLowerCase().startsWith(action.payload.toLowerCase())
    ));

    return { allRepos, originalRepos, searchText: action.payload };
  },
  [REPO_SYNC]: (state, action) => {
    if (action.success) {
      return { success: 'Successfully synced repos.' };
    }
    return undefined;
  },
  [REPO_UPDATE]: (state, action) => {
    if (action.success) {
      return {
        success: `Successfully updated ${action.repoName}.`,
        error: undefined,
        loading: undefined
      };
    } else if (action.loading) {
      return {
        error: action.undefined, loading: true, success: undefined
      };
    }
    return { error: action.payload, loading: undefined, success: undefined };
  }
};

export default createReducer(initialState, handlers);
