"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChannel = createChannel;

var _filterIsNot = _interopRequireDefault(require("./utils/filterIsNot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var channels = {};

function createChannel(instance, namespaceArg) {
  var namespace = namespaceArg;

  if (namespace === undefined) {
    namespace = 'default';
  }

  if (channels[namespace] === undefined) {
    channels[namespace] = [];
  }

  var handlers = {};
  var anyKeyHandlers = [];
  /*
   * Handler function for this channel to receive
   * all messages broadcasted in the namespace.
   */

  var superHandler = function superHandler(key, message) {
    anyKeyHandlers.forEach(function (handler) {
      handler.apply(void 0, [key].concat(_toConsumableArray(message)));
    });

    if (handlers[key] === undefined) {
      // no handlers
      return;
    }

    handlers[key].forEach(function (handler) {
      handler.apply(void 0, _toConsumableArray(message));
    });
  };

  var hasRegisteredGlobally = false;

  var addChannelSuperHandler = function addChannelSuperHandler() {
    if (hasRegisteredGlobally) {
      return;
    }

    channels[namespace].push([instance, superHandler]);
    hasRegisteredGlobally = true;
  };

  var hasUnsubscribed = false;

  var subscribeInit = function subscribeInit(callback) {
    if (hasUnsubscribed) {
      return;
    }

    addChannelSuperHandler();
    callback();
  };

  var appendFunctions = function appendFunctions(funcA, funcB) {
    return function () {
      funcA.apply(void 0, arguments);
      funcB.apply(void 0, arguments);
    };
  };

  var channelObj = {
    on: function on(key, handler) {
      subscribeInit(function () {
        if (handlers[key] === undefined) {
          handlers[key] = [];
        }

        handlers[key].push(handler);
      });
    },
    once: function once(key, handler) {
      var wrappedHandler = appendFunctions(handler, function () {
        channelObj.remove(key, wrappedHandler);
      });
      channelObj.on(key, wrappedHandler);
    },
    onAny: function onAny(handler) {
      subscribeInit(function () {
        anyKeyHandlers.push(handler);
      });
    },
    onceAny: function onceAny(handler) {
      var wrappedHandler = appendFunctions(handler, function () {
        channelObj.removeAny(wrappedHandler);
      });
      channelObj.onAny(wrappedHandler);
    },
    remove: function remove(key, handler) {
      if (handlers[key] === undefined) {
        return;
      }

      handlers[key] = (0, _filterIsNot["default"])(handlers[key], handler);
    },
    removeAny: function removeAny(handler) {
      anyKeyHandlers = (0, _filterIsNot["default"])(anyKeyHandlers, handler);
    },
    emit: function emit(key) {
      for (var _len = arguments.length, message = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      if (hasUnsubscribed) {
        return;
      }

      channels[namespace].forEach(function (tuple) {
        var remoteHandler = tuple[1];
        remoteHandler(key, message);
      });
    },
    emitAsync: function emitAsync() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      setTimeout(function () {
        channelObj.emit.apply(channelObj, args);
      }, 0);
    },
    unsubscribe: function unsubscribe() {
      if (hasUnsubscribed) {
        return;
      }

      if (hasRegisteredGlobally) {
        channels[namespace] = channels[namespace].filter(function (n) {
          return n[0] !== instance;
        });
      }

      hasUnsubscribed = true;
    }
  };
  return channelObj;
}