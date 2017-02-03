import { BOT_LOAD } from '../actions';

let assignedBot;

const PREFIXES = ['AC-', 'AT-', 'DR-', 'GR-'];

function getRandomBot() {
  const randomPrefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const randomNumber = `000${Math.floor(Math.random() * 101)}`.slice(-3);
  return {
    name: `${randomPrefix}${randomNumber}`
  };
}

export function loadBot() {
  return (dispatch) => {
    if (!assignedBot) {
      assignedBot = getRandomBot();
    }
    dispatch({ type: BOT_LOAD, payload: assignedBot });
  };
}

export default { loadBot };
