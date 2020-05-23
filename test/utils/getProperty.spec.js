import getProperty from '../../src/utils/getProperty';

test('able to get property', () => {
  const obj = {
    a: 'some value'
  };

  expect(getProperty(obj, 'a')).toBe(obj.a);
  expect(getProperty(obj, 'b', 'c')).toBe('c');
});
