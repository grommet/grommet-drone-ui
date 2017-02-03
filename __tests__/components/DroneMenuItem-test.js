import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { Router, createMemoryHistory } from 'react-router';

import DroneMenuItem from '../../src/js/components/DroneMenuItem';
import store from '../../src/js/store';
import { addSession } from '../../src/js/actions/session';

store.dispatch(addSession({
  token: 'test', user: { login: 'abc', avatar_url: 'http://test.com' }
}));

const history = createMemoryHistory('/');

const routes = [{
  path: '/',
  component: () => <DroneMenuItem />
}];

// needed because this:
// https://github.com/facebook/jest/issues/1353
jest.mock('react-dom');

test('DroneMenuItem renders', () => {
  const component = renderer.create(
    <Provider store={store}>
      <Router routes={routes} history={history} />
    </Provider>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
