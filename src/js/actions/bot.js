import { BOT_LOAD, BOT_NEW_MESSAGE } from '../actions';

import DroneCLI from '../cli/DroneCLI';
import addProjectCommand from '../cli/add-project-command';
import removeProjectCommand from '../cli/remove-project-command';
import restartProjectCommand from '../cli/restart-project-command';
import restartInContextCommand from '../cli/restart-in-context-command';

let assignedBot;

const PREFIXES = ['AC-', 'AT-', 'DR-', 'GR-'];

const cli = new DroneCLI();
cli.use(addProjectCommand);
cli.use(removeProjectCommand);
cli.use(restartProjectCommand);

const inContextCli = new DroneCLI();
inContextCli.use(restartInContextCommand);

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

export function processInContextMessage(message, context) {
  return dispatch => inContextCli.addContext(context).run(message)
    .then(result => (
      dispatch({ type: BOT_NEW_MESSAGE, payload: result })
    ), result => (
      dispatch({ type: BOT_NEW_MESSAGE, payload: result })
    ));
}

export function processMessage(message) {
  return dispatch => cli.addContext(dispatch).run(message).then(result => (
    dispatch({ type: BOT_NEW_MESSAGE, payload: result })
  ), result => (
    dispatch({ type: BOT_NEW_MESSAGE, payload: result })
  ));
}

export default { loadBot, processInContextMessage, processMessage };
