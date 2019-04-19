import React from 'react';
import renderer from 'react-test-renderer';

import LoudHailer from '../src/loudHailer';
import { createChannel } from '../src/channel';

function TestComponent(props) {
  const { text, channel, ...otherProps } = props;
  channel.emit('TestComponent:created');
  return (
    <div {...otherProps}>
      {text}
    </div>
  );
}

test('test component wrapping successfully', () => {
  const WrappedTestComponent = LoudHailer(TestComponent);

  const component = renderer.create(
    <WrappedTestComponent text="testing" className="lead" />
  );
  const description = component.toJSON();
  expect(description.type).toBe('div');
  expect(Object.keys(description.props)).toContain('className');
});

test('test component communication successfully', () => {
  const WrappedTestComponent = LoudHailer(TestComponent);

  let hasComponentCreated = false;
  const outsideChannel = createChannel();

  outsideChannel.on('TestComponent:created', () => {
    hasComponentCreated = true;
  });

  const component = renderer.create(
    <WrappedTestComponent text="testing" className="lead" />
  );
  expect(hasComponentCreated).toBe(true);
});

test('test component communication successfully', () => {
  const WrappedTestComponent = LoudHailer(TestComponent);
  const component = renderer.create(
    <WrappedTestComponent text="testing" className="lead" />
  );
  component.unmount();
});
