import { combineReducers } from 'redux';

import bot from './bot';
import nav from './nav';
import repo from './repo';
import session from './session';
import user from './user';

export default combineReducers({
  bot,
  nav,
  repo,
  session,
  user
});
