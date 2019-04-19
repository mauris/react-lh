import loudHailer, { createChannel } from '../src';

test('loudHailer exported successfully', () => {
  expect(typeof loudHailer).toBe('function');
});

test('createChannel exported successfully', () => {
  expect(typeof createChannel).toBe('function');
});
