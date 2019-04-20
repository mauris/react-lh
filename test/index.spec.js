import loudHailer, { createChannel, CrossWindow } from '../src';

test('loudHailer exported successfully', () => {
  expect(typeof loudHailer).toBe('function');
});

test('createChannel exported successfully', () => {
  expect(typeof createChannel).toBe('function');
});

test('CrossWindow exported successfully', () => {
  expect(typeof CrossWindow).toBe('function');
});
