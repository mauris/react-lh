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

FuncTestComponent.propTypes = {
  callback: PropTypes.func.isRequired
};

function FuncTestComponent2({ callback, loadCallback, value }) {
  useLoudHailer((channel) => {
    loadCallback();
    channel.on('test:emit', (data) => {
      callback(data, value);
    });
  }, [value, loadCallback]);

  return (
    <div></div>
  );
}

FuncTestComponent2.propTypes = {
  callback: PropTypes.func.isRequired,
  loadCallback: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
};

test('test component prop dependency', () => {
  let counter = 0;
  const loadCallback = jest.fn();

  const callback = (data, value) => {
    counter = data + value;
  };
  const channel = createChannel();
  let component;

  act(() => {
    component = renderer.create(
      <FuncTestComponent2 value={1} loadCallback={loadCallback} callback={callback} />
    );
  });
  const emitData = Math.ceil(Math.random() * 1000);
  channel.emit('test:emit', emitData);
  expect(counter).toBe(emitData + 1);
  expect(loadCallback.mock.calls.length).toBe(1);

  act(() => {
    component.update(
      <FuncTestComponent2 value={2} loadCallback={loadCallback} callback={callback} />
    );
  });

  // ensure unsubscribed
  const emitData2 = Math.ceil(Math.random() * 1000);
  channel.emit('test:emit', emitData2);
  expect(counter).toBe(emitData2 + 2);
  expect(loadCallback.mock.calls.length).toBe(2);

  component.unmount();
});

function FuncTestComponent3({
  callback, loadCallback, value1, value2
}) {
  useLoudHailer((channel) => {
    loadCallback();
    channel.on('test:emit', (data) => {
      callback(data, value1);
    });
  }, [value1]);

  return (
    <div>{value2}</div>
  );
}

FuncTestComponent3.propTypes = {
  loadCallback: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  value1: PropTypes.number.isRequired,
  value2: PropTypes.number.isRequired
};

test('test component unrelated prop dependency', () => {
  let counter = 0;
  const loadCallback = jest.fn();

  const callback = (data, value) => {
    counter = data + value;
  };
  const channel = createChannel();
  let component;

  act(() => {
    component = renderer.create(
      <FuncTestComponent3 value1={1} value2={2} loadCallback={loadCallback} callback={callback} />
    );
  });
  const emitData = Math.ceil(Math.random() * 1000);
  channel.emit('test:emit', emitData);
  expect(counter).toBe(emitData + 1);
  expect(loadCallback.mock.calls.length).toBe(1);

  act(() => {
    component.update(null);
  });

  // ensure unsubscribed
  const emitData2 = Math.ceil(Math.random() * 1000);
  channel.emit('test:emit', emitData2);
  expect(counter).toBe(emitData + 1);
  expect(loadCallback.mock.calls.length).toBe(1);

  component.unmount();
});

test('test multiple components will receive message', () => {
  let counter = 0;

  const loadCallback = jest.fn();

  const callback = (data, value) => {
    counter += data + value;
  };

  let numComponents = 1000;
  let component;
  act(() => {
    component = renderer.create(
      <span>
        {Array.from({ length: numComponents }, (_, i) => i + 1).map((id) => (
          <FuncTestComponent3
            key={id}
            value1={1}
            value2={2}
            loadCallback={loadCallback}
            callback={callback}
          />
        ))}
      </span>
    );
  });

  const channel = createChannel();
  expect(loadCallback.mock.calls.length).toBe(numComponents);

  const emitData = Math.ceil(Math.random() * 1000);
  channel.emit('test:emit', emitData);
  expect(counter).toBe((emitData + 1) * numComponents);

  numComponents = 500;
  counter = 0;
  act(() => {
    component.update(
      <span>
        {Array.from({ length: numComponents }, (_, i) => i + 1).map((id) => (
          <FuncTestComponent3
            key={id}
            value1={2}
            value2={2}
            loadCallback={loadCallback}
            callback={callback}
          />
        ))}
      </span>
    );
  });
  const emitData2 = Math.ceil(Math.random() * 1000);
  channel.emit('test:emit', emitData2);
  expect(counter).toBe((emitData2 + 2) * numComponents);

  act(() => {
    component.update(null);
  });

  // ensure unsubscribed
  const emitData3 = Math.ceil(Math.random() * 1000);
  channel.emit('test:emit', emitData3);
  expect(counter).toBe((emitData2 + 2) * numComponents);
  expect(loadCallback.mock.calls.length).toBe(1500);

  component.unmount();
});
