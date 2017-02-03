import {
  SESSION_LOAD
} from '../actions';
import { createReducer } from './utils';

const initialState = {};

const handlers = {
  [SESSION_LOAD]: (state, action) => action.payload
};

export default createReducer(initialState, handlers);
