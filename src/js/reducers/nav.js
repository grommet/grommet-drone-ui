import { NAV_SHOW, NAV_HIDE } from '../actions';
import { createReducer } from './utils';

const initialState = {
  hide: false
};

const handlers = {
  [NAV_SHOW]: () => ({ show: true }),
  [NAV_HIDE]: () => ({ show: false }),
};

export default createReducer(initialState, handlers);
