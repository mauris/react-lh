"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getProperty;

function getProperty(obj, propName, defaultValue) {
  if (obj && obj[propName]) {
    return obj[propName];
  }

  return defaultValue;
}