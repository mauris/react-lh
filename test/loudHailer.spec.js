import React from 'react';
import renderer from 'react-test-renderer';
import PropTypes from 'prop-types';

import loudHailer from '../src/loudHailer';
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

TestComponent.propTypes = {
  text: PropTypes.string,
  channel: PropTypes.shape({
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired
  }).isRequired
};

TestComponent.defaultProps = {
  text: ''
};

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
