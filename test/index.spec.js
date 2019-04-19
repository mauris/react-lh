import LoudHailer, { createChannel } from '../src';

test('LoudHailer exported successfully', () => {
  expect(typeof LoudHailer).toBe('function');
});

test('createChannel exported successfully', () => {
  expect(typeof createChannel).toBe('function');
});
