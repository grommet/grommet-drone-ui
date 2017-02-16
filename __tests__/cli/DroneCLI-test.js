import DroneCLI from '../../src/js/cli/DroneCLI';

const cli = new DroneCLI();

test('DroneCLI executes basic help', () => {
  cli.run('help').then(result => expect(result).toMatchSnapshot());
});

test('DroneCLI shows help for help command', () => {
  cli.run('help help').then(result => expect(result).toMatchSnapshot());
});

test('DroneCLI shows help for invalid command', () => {
  cli.run('fake').then(result => expect(result).toMatchSnapshot());
});

test('DroneCLI shows help for invalid help option', () => {
  cli.run('help fake').then(result => expect(result).toMatchSnapshot());
});

const customCLI = new DroneCLI();
customCLI.command(
  'restart [project]', 'Restarts a given build for a project'
)
.option(
  'buildNumber',
  'Optional. Number of the build to restart. Defaults to the last build'
)
.option(
  'anotherOption',
  'Optional. Fake description'
)
.action(() => {
  Promise.resolve('test');
});

test('DroneCLI adds a custom command', () => {
  customCLI.run('help').then(result => expect(result).toMatchSnapshot());
});

test('DroneCLI shows help for a custom command', () => {
  customCLI.run('help restart').then(result => expect(result).toMatchSnapshot());
});

test('DroneCLI executes action from a custom command', () => {
  const customActionCLI = new DroneCLI();
  customActionCLI.command(
    'restart [project]', 'Restarts a given build for a project'
  ).action(() => Promise.resolve('abc'));

  customActionCLI.run('restart').then(result => expect(result).toBe('abc'));
});

test('DroneCLI fails for invalid args', () => {
  const customActionCLI = new DroneCLI();
  customActionCLI.command(
    'restart [project]', 'Restarts a given build for a project'
  ).validate(() => 'Invalid');

  customActionCLI.run('restart').then(
    () => {}, result => expect(result).toBe('Invalid')
  );
});

test('DroneCLI fails for invalid args', () => {
  const customActionCLI = new DroneCLI();
  customActionCLI.command(
    'restart [project]', 'Restarts a given build for a project'
  ).validate(() => true).action(() => Promise.resolve('abc'));

  customActionCLI.run('restart').then(result => expect(result).toBe('abc'));
});
