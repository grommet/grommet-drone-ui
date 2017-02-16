import { BOT_LOAD, BOT_NEW_MESSAGE } from '../actions';
import { createReducer } from './utils';

const initialState = {
  bot: undefined
};

const handlers = {
  [BOT_LOAD]: (state, action) => ({ bot: action.payload }),
  [BOT_NEW_MESSAGE]: (state, action) => {
    if (state.bot) {
      const bot = { ...state.bot };
      bot.response = action.payload;

      return { bot };
    }
    return undefined;
  }
};

export default createReducer(initialState, handlers);
