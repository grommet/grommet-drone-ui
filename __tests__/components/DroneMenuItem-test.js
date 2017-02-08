import React from 'react';
import renderer from 'react-test-renderer';

import DroneMenuItem from '../../src/js/components/DroneMenuItem';

// needed because this:
// https://github.com/facebook/jest/issues/1353
jest.mock('react-dom');

test('DroneMenuItem renders', () => {
  const component = renderer.create(
    <DroneMenuItem />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
