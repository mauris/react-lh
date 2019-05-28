"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = iterateObject;

function iterateObject(obj, handler) {
  var iteratorObj = {
    iterate: function iterate(cb) {
      return Object.keys(obj).map(function (key) {
        return cb({
          key: key,
          value: obj[key]
        });
      });
    }
  };

  if (handler !== undefined) {
    return iteratorObj.iterate(handler);
  }

  return iteratorObj;
}