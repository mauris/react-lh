export default function getProperty(obj, propName, defaultValue) {
  if (obj && obj[propName]) {
    return obj[propName];
  }
  return defaultValue;
}
