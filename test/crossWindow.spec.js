import React from 'react';
import renderer from 'react-test-renderer';

import loudHailer from '../src/loudHailer';
import CrossWindow from '../src/crossWindow';

import TestComponent from './TestComponent';

const WrappedTestComponent = loudHailer(TestComponent);

test('CrossWindow exported successfully', () => {
  expect(typeof CrossWindow).toBe('function');
});

test('emit successfully', () => {
  const component = renderer.create(
    <CrossWindow channels={['default']}>
      <WrappedTestComponent text="testing" className="lead" />
    </CrossWindow>
  );

  const description = component.toJSON();
  expect(localStorage.setItem).toHaveBeenLastCalledWith('lh:default:TestComponent:created', '[]');
});
