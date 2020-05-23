export default function getProperty(obj, propName, defaultValue) {
  if (obj && obj[propName] !== undefined) {
    return obj[propName];
  }
  return defaultValue;
}
