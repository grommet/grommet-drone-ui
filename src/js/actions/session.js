import { SESSION_LOAD } from '../actions';
import { updateHeaders } from '../api/utils';

function getToken() {
  let token = window.STATE_FROM_SERVER && window.STATE_FROM_SERVER.csrf;
  if (!token) {
    const meta = document.querySelector('meta[name=csrf-token]');
    if (meta) {
      token = meta.getAttribute('content');
    }
  }
  return token;
}

function getUser() {
  return window.STATE_FROM_SERVER && window.STATE_FROM_SERVER.user;
}

function dispatchSessionLoad(dispatch, session) {
  updateHeaders({ 'X-CSRF-TOKEN': session.token });
  dispatch({
    type: SESSION_LOAD, payload: session
  });
}

export function addSession(session) {
  return (dispatch) => {
    if (session) {
      dispatchSessionLoad(dispatch, session);
    }
  };
}

export function initialize() {
  return (dispatch) => {
    const token = getToken();
    const user = getUser();
    if (user && token) {
      dispatchSessionLoad(dispatch, { user, token });
    }
  };
}

export default { addSession, initialize };
