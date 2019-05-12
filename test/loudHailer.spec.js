import React from 'react';
import renderer from 'react-test-renderer';

import loudHailer from '../src/loudHailer';
import { createChannel } from '../src/channel';

import TestComponent from './TestComponent';

test('test component wrapping successfully', () => {
  const WrappedTestComponent = loudHailer(TestComponent);

  const component = renderer.create(
    <WrappedTestComponent text="testing" className="lead" />
  );
  const description = component.toJSON();
  expect(description.type).toBe('div');
  expect(Object.keys(description.props)).toContain('className');
});

test('test component communication successfully', () => {
  const WrappedTestComponent = loudHailer(TestComponent);

  let hasComponentCreated = false;
  const outsideChannel = createChannel();

  outsideChannel.on('TestComponent:created', () => {
    hasComponentCreated = true;
  });

  renderer.create(
    <WrappedTestComponent text="testing" className="lead" />
  );
  expect(hasComponentCreated).toBe(true);
});

test('test component communication successfully', () => {
  const WrappedTestComponent = loudHailer(TestComponent);
  const component = renderer.create(
    <WrappedTestComponent text="testing" className="lead" />
  );
  component.unmount();
});

test('test get wrapped instance successfully', () => {
  const WrappedTestComponent = loudHailer(TestComponent);
  const component = new WrappedTestComponent({});
  expect(typeof component.getInstance()).toBe('object');
});
