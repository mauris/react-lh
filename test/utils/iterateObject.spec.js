import iterateObject from '../../src/utils/iterateObject';

test('object iteration successful', () => {
  const obj = {
    a: false,
    b: false,
    c: false
  };

  iterateObject(obj).iterate(({ key, value }) => {
    expect(value).toBe(false);
    expect(value).toBe(obj[key]);
    obj[key] = !value;
  });
});

test('object iteration successful directly', () => {
  const obj = {
    a: false,
    b: false,
    c: false
  };

  iterateObject(obj, ({ key, value }) => {
    expect(value).toBe(false);
    expect(value).toBe(obj[key]);
    obj[key] = !value;
  });
});
