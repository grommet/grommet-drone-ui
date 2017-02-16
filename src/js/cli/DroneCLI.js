const optionRegex = /--(.+)=(.+)/;
const argRegex = /\[(.+)\]/;

function parseTask(taskAsString = '') {
  const taskBlocks = taskAsString.trim().split(' ');

  const task = {
    args: [],
    options: {}
  };

  taskBlocks.forEach((taskBlock, index) => {
    if (taskBlock !== '') {
      if (index === 0) {
        task.command = taskBlock;
      } else if (optionRegex.test(taskBlock)) {
        const matchBlocks = optionRegex.exec(taskBlock);
        const name = matchBlocks[1];
        const value = matchBlocks[2];
        task.options[name] = value;
      } else {
        task.args.push(taskBlock);
      }
    }
  });

  return task;
}

function parseCommandArgs(name = '') {
  const args = [];

  const commandNameBlocks = name.trim().split(' ').slice(1);
  commandNameBlocks.forEach((commandNameBlock) => {
    if (argRegex.test(commandNameBlock)) {
      args.push(argRegex.exec(commandNameBlock)[1]);
    }
  });

  return args;
}

function getArgsForCommand(command, task) {
  const args = {};

  const commandArgNames = parseCommandArgs(command.name);
  if (task.args.length <= commandArgNames.length) {
    task.args.forEach((arg, index) => (
      args[commandArgNames[index]] = arg
    ));
  } else {
    throw Error('Sorry this is an invalid format for this command.');
  }

  args.options = task.options;

  return args;
}

function commandToJSX(command) {
  const options = command.options.map(option => option.description);
  const jsxCommand = [
    command.description
  ].concat(options);

  if (command.example) {
    jsxCommand.push(command.example);
  }
  return jsxCommand;
}

function commandsToJSX(commands) {
  return ([
    'Sure, here are the commands I can process...',
    commands.map(command => command.name).join(', ')
  ]);
}

export default class DroneCLI {
  constructor() {
    this._commands = [];

    this._addHelpCommand();
  }

  _addHelpCommand() {
    const commands = this._commands;
    const helpCommand = {
      name: 'help [command]',
      description: (
        'This command provides help for other commands, interesting...'
      ),
      options: [],
      action: args => (
        new Promise((resolve) => {
          if (args.command) {
            let matchCommand;
            commands.some((command) => {
              if (command.name.startsWith(args.command)) {
                matchCommand = command;
                return true;
              }
              return false;
            });

            if (matchCommand) {
              resolve(commandToJSX(matchCommand));
            } else {
              resolve('Sorry, I can\'t process this task.');
            }
          } else {
            resolve(commandsToJSX(commands));
          }
        })
      )
    };
    this._commands.push(helpCommand);
  }

  run(taskAsString) {
    const task = parseTask(taskAsString);

    let matchCommand;
    this._commands.some((command) => {
      if (command.name.startsWith(task.command)) {
        matchCommand = command;
        return true;
      }
      return false;
    });

    try {
      if (matchCommand) {
        const args = getArgsForCommand(matchCommand, task);
        if (matchCommand.validate) {
          const result = matchCommand.validate(args);
          if (result === true) {
            return matchCommand.action(args, this._dispatch);
          }
          return Promise.reject(result);
        }
        return matchCommand.action(args, this._dispatch);
      }
    } catch (e) {
      return Promise.reject(e.message);
    }

    return Promise.reject('Sorry, I can\'t process this task.');
  }

  command(name, description, example) {
    if (name && description) {
      const command = {
        action: () => Promise.resolve(
          'No action has been associated with this command yet'
        ),
        description,
        name,
        example,
        options: []
      };
      this._commands.push(command);
      const wrapper = {
        action: (action) => {
          command.action = action;

          return wrapper;
        },
        option: (optionName, optionDescription) => {
          if (optionName && optionDescription) {
            command.options.push({
              name: optionName,
              description: optionDescription
            });

            return wrapper;
          }
          throw Error('Option name and description is mandatory');
        },
        validate: (validate) => {
          command.validate = validate;

          return wrapper;
        }
      };
      return wrapper;
    }
    throw Error('Name and description is mandatory');
  }

  addDispatch(dispatch) {
    this._dispatch = dispatch;

    return this;
  }

  use(command) {
    command(this);
  }
}
