import { NAV_HIDE, NAV_SHOW } from '../actions';
import { createReducer } from './utils';

const initialState = {
  hide: false
};

const handlers = {
  [NAV_HIDE]: () => ({ hide: true }),
  [NAV_SHOW]: () => ({ hide: false }),
};

export default createReducer(initialState, handlers);
