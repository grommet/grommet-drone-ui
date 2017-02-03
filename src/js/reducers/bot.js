import { BOT_LOAD } from '../actions';
import { createReducer } from './utils';

const initialState = {
  bot: undefined
};

const handlers = {
  [BOT_LOAD]: (state, action) => action.payload
};

export default createReducer(initialState, handlers);
