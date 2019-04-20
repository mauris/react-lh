export default function iterateObject(obj, handler) {
  const iteratorObj = {
    iterate: (cb) => {
      return Object.keys(obj).map(key => cb(key, obj[key]));
    }
  };

  if (handler !== undefined) {
    return iteratorObj.iterate(handler);
  }
  return iteratorObj;
}
