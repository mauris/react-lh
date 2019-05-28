"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = filterIsNot;

function filterIsNot(arr, item) {
  return arr.filter(function (x) {
    return x !== item;
  });
}