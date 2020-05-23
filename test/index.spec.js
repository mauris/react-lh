import loudHailer, {
  wrapper,
  createChannel,
  CrossWindow,
  useLoudHailer,
  useChannel,
  useOnEvent,
  useOnceEvent
} from '../src';

test('loudHailer exported successfully', () => {
  expect(typeof loudHailer).toBe('function');
});

test('wrapper exported successfully', () => {
  expect(typeof wrapper).toBe('function');
  expect(wrapper).toBe(loudHailer);
});

test('createChannel exported successfully', () => {
  expect(typeof createChannel).toBe('function');
});

test('CrossWindow exported successfully', () => {
  expect(typeof CrossWindow).toBe('function');
});

test('useChannel exported successfully', () => {
  expect(typeof useChannel).toBe('function');
});

test('useLoudHailer exported successfully', () => {
  expect(typeof useLoudHailer).toBe('function');
});

test('useOnEvent exported successfully', () => {
  expect(typeof useOnEvent).toBe('function');
});

test('useOnceEvent exported successfully', () => {
  expect(typeof useOnceEvent).toBe('function');
});
