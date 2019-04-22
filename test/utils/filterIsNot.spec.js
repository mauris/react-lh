import filterIsNot from '../../src/utils/filterIsNot';

test('remove object successfully', () => {
  const arr = ['a', 'b', 'c'];

  const final = filterIsNot(arr, 'b');
  expect(final.length).toBe(2);
  expect(final).toEqual(expect.arrayContaining(['a', 'c']));
});

test('not change array for non existent object', () => {
  const arr = ['a', 'b', 'c'];

  const final = filterIsNot(arr, 'd');
  expect(final.length).toBe(3);
  expect(final).toEqual(expect.arrayContaining(['a', 'b', 'c']));
});
