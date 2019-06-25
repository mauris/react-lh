import React from 'react';
import PropTypes from 'prop-types';
import renderer, { act } from 'react-test-renderer';

import useLoudHailer from '../src/useLoudHailer';
import { createChannel } from '../src/channel';

function FuncTestComponent(props) {
  const { callback } = props;
  useLoudHailer((channel) => {
    channel.on('test:emit', (data) => {
      callback(data);
    });
  });
  return (
    <div></div>
  );
}

FuncTestComponent.propTypes = {
  callback: PropTypes.func.isRequired
};

test('test component wrapping successfully', () => {
  let counter = 0;

  const callback = (data) => {
    counter = data;
  };
  const channel = createChannel();
  let component;

  act(() => {
    component = renderer.create(
      <FuncTestComponent callback={callback} />
    );
  });
  const emitData = Math.ceil(Math.random() * 1000);
  channel.emit('test:emit', emitData);
  expect(counter).toBe(emitData);
  component.unmount();

  // ensure unsubscribed
  const emitData2 = emitData - 5;
  channel.emit('test:emit', emitData2);
  expect(counter).toBe(emitData);
});
