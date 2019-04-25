import { createChannel } from '../src/channel';

test('createChannel exported successfully', () => {
  expect(typeof createChannel).toBe('function');
});

const randomLoop = (callback, n = 50) => {
  const randomCount = Math.floor(Math.random() * n) + 1;
  for (let i = 0; i < randomCount; i += 1) {
    callback(i);
  }
  return randomCount;
};

test('createChannel creates an instance', () => {
  const channel = createChannel();
  expect(typeof channel).toBe('object');
  expect(typeof channel.on).toBe('function');
  expect(typeof channel.emit).toBe('function');
  expect(typeof channel.unsubscribe).toBe('function');
});

test('two channels can communicate', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  let counterReceived = 0;
  let counterSent = 0;

  channelA.on('count', () => {
    counterReceived += 1;
  });

  const randomCount = randomLoop(() => {
    counterSent += 1;
    channelB.emit('count');
  });
  expect(counterSent).toBe(randomCount);
  expect(counterReceived).toBe(randomCount);
});

test('two channels can communicate with arguments', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  let counterReceived = 0;
  let counterSent = 0;

  channelA.on('count', (message) => {
    counterReceived += message;
  });

  randomLoop(() => {
    const message = Math.round(Math.random() * 100 + 5);
    counterSent += message;
    channelB.emit('count', message);
  });
  expect(counterSent).toBe(counterReceived);
});

test('once works', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  let counterReceived = 0;
  let counterSent = 0;

  channelA.once('count', (message) => {
    counterReceived += message;
  });

  const randomCount = randomLoop(() => {
    counterSent += 1;
    channelB.emit('count', 1);
  });
  expect(counterSent).toBe(randomCount);
  expect(counterReceived).toBe(1);
});

test('channels should handle multiple keys correctly', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  const countersSent = {};
  const countersReceived = {};

  const keys = [
    'a',
    'b',
    'c'
  ];

  keys.forEach((key) => {
    countersSent[key] = 0;
    countersReceived[key] = 0;

    channelA.on(`count_${key}`, () => {
      countersReceived[key] += 1;
    });
  });

  const randomCount = randomLoop(() => {
    const keyToSendTo = keys[Math.floor(Math.random() * keys.length)];
    countersSent[keyToSendTo] += 1;
    channelB.emit(`count_${keyToSendTo}`);
  });

  const totalSent = keys.map(k => countersSent[k]).reduce((acc, cur) => acc + cur, 0);
  const totalReceived = keys.map(k => countersReceived[k]).reduce((acc, cur) => acc + cur, 0);
  expect(totalSent).toBe(randomCount);
  expect(totalReceived).toBe(randomCount);

  keys.forEach((k) => {
    expect(countersReceived[k]).toBe(countersSent[k]);
  });
});

test('handle remove subscriber correctly', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  let counterReceived = 0;
  let counterSent = 0;

  const handler = () => {
    counterReceived += 1;
  };
  channelA.on('count', handler);
  channelA.remove('count', handler);

  const randomCount = randomLoop(() => {
    counterSent += 1;
    channelB.emit('count');
  });

  expect(counterReceived).toBe(0);
  expect(counterSent).toBe(randomCount);
});

test('handle remove non-existent listener correctly', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  let counterReceived = 0;
  let counterSent = 0;

  const handler = () => {
    counterReceived += 1;
  };
  channelA.on('countB', handler);
  channelA.remove('countA', handler);

  const randomCount = randomLoop(() => {
    counterSent += 1;
    channelB.emit('countB');
  });

  expect(counterReceived).toBe(randomCount);
  expect(counterSent).toBe(randomCount);
});

test('receive should not go through when unsubscribed', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  let counterReceived = 0;
  let counterSent = 0;

  channelA.unsubscribe();
  channelA.on('count', () => {
    counterReceived += 1;
  });

  const randomCount = randomLoop(() => {
    counterSent += 1;
    channelB.emit('count');
  });

  expect(counterReceived).toBe(0);
  expect(counterSent).toBe(randomCount);
});

test('emit should not go through when unsubscribed', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  let counterReceived = 0;

  channelB.unsubscribe();
  channelA.on('count', () => {
    counterReceived += 1;
  });

  randomLoop(() => {
    channelB.emit('count');
  });

  expect(counterReceived).toBe(0);
});

test('unsubscribe', () => {
  const obj = {};

  const channel = createChannel(obj);
  // register globally
  channel.on('test', () => {});
  channel.unsubscribe();
});

test('onAny works', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  const keys = [
    'kA',
    'kB',
    'kC'
  ];

  let counterReceived = 0;
  let counterSent = 0;

  channelA.onAny((key) => {
    expect(keys.indexOf(key)).not.toBe(-1);
    counterReceived += 1;
  });

  const randomCount = randomLoop(() => {
    counterSent += 1;
    channelB.emit(keys[Math.floor(Math.random() * keys.length)]);
  });
  expect(counterSent).toBe(randomCount);
  expect(counterReceived).toBe(randomCount);
});

test('onceAny works', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  const keys = [
    'kA',
    'kB',
    'kC'
  ];

  let counterReceived = 0;
  let counterSent = 0;

  channelA.onceAny((key) => {
    expect(keys.indexOf(key)).not.toBe(-1);
    counterReceived += 1;
  });

  const randomCount = randomLoop(() => {
    counterSent += 1;
    channelB.emit(keys[Math.floor(Math.random() * keys.length)]);
  });
  expect(counterSent).toBe(randomCount);
  expect(counterReceived).toBe(1);
});

test('onAny should not handle after unsubscribe', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  const keys = [
    'kA',
    'kB',
    'kC'
  ];

  channelA.unsubscribe();

  let counterReceived = 0;
  let counterSent = 0;

  channelA.onAny((key) => {
    counterReceived += 1;
  });

  const randomCount = randomLoop(() => {
    counterSent += 1;
    channelB.emit(keys[Math.floor(Math.random() * keys.length)]);
  });
  expect(counterSent).toBe(randomCount);
  expect(counterReceived).toBe(0);
});

test('removing onAny listener works', () => {
  const channelA = createChannel();
  const channelB = createChannel();

  const keys = [
    'kA',
    'kB',
    'kC'
  ];

  let counterReceived = 0;
  let counterSent = 0;

  const anyHandler = (key) => {
    counterReceived += 1;
  };

  channelA.onAny(anyHandler);
  channelA.removeAny(anyHandler);

  const randomCount = randomLoop(() => {
    counterSent += 1;
    channelB.emit(keys[Math.floor(Math.random() * keys.length)]);
  });
  expect(counterSent).toBe(randomCount);
  expect(counterReceived).toBe(0);
});
