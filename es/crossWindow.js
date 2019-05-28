"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _channel = require("./channel");

var _iterateObject = _interopRequireDefault(require("./utils/iterateObject"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var STORAGE_EVENT_KEY = 'storage';
var STORAGE_LOCATION = window.localStorage;

var CrossWindow =
/*#__PURE__*/
function (_Component) {
  _inherits(CrossWindow, _Component);

  _createClass(CrossWindow, null, [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var changes = {};
      var channels = props.channels;

      if (channels !== state.channels) {
        var tempOldContainer = _objectSpread({}, state.channelsContainer);

        var newContainer = {};
        channels.forEach(function (channel) {
          if (tempOldContainer[channel] === undefined) {
            // new one needs to be created
            var newChannel = (0, _channel.createChannel)(channel);
            newChannel.onAny(function (key) {
              for (var _len = arguments.length, message = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                message[_key - 1] = arguments[_key];
              }

              STORAGE_LOCATION.setItem("lh:".concat(channel, ":").concat(key), JSON.stringify(message));
            });
            newContainer[channel] = newChannel;
            return;
          } // transfer from previous state


          newContainer[channel] = tempOldContainer[channel];
          delete tempOldContainer[channel];
        });
        (0, _iterateObject["default"])(tempOldContainer).iterate(function (_ref) {
          var value = _ref.value;
          value.unsubscribe();
        });
        changes = _objectSpread({}, changes, {
          channels: channels,
          channelsContainer: newContainer
        });
      }

      return changes;
    }
  }, {
    key: "propTypes",
    get: function get() {
      return {
        channels: _propTypes["default"].arrayOf(_propTypes["default"].string),
        children: _propTypes["default"].oneOfType([_propTypes["default"].arrayOf(_propTypes["default"].node), _propTypes["default"].node])
      };
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return {
        channels: ['default'],
        children: []
      };
    }
  }]);

  function CrossWindow(props) {
    var _this;

    _classCallCheck(this, CrossWindow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CrossWindow).call(this, props));
    _this.state = {
      channels: [],
      channelsContainer: {}
    };

    _this.storageEventHandler = function (storageEvent) {
      var key = storageEvent.key;

      if (!key || !key.startsWith('lh:')) {
        return;
      }

      var _this$state = _this.state,
          channels = _this$state.channels,
          channelsContainer = _this$state.channelsContainer;

      if (storageEvent.storageArea !== STORAGE_LOCATION) {
        // mismatched storage location
        return;
      }

      channels.forEach(function (channel) {
        var channelKey = "lh:".concat(channel, ":");

        if (!key.startsWith(channelKey)) {
          return;
        }

        var messageKey = key.substring(channelKey.length);
        var newValue = storageEvent.newValue;
        var message = JSON.parse(newValue);
        channelsContainer[channel].emit.apply(null, [messageKey].concat(_toConsumableArray(message)));
      });
    };

    window.addEventListener(STORAGE_EVENT_KEY, _this.storageEventHandler);
    return _this;
  }

  _createClass(CrossWindow, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener(STORAGE_EVENT_KEY, this.storageEventHandler);
      var channelsContainer = this.state.channelsContainer;
      (0, _iterateObject["default"])(channelsContainer).iterate(function (_ref2) {
        var value = _ref2.value;
        value.unsubscribe();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return children;
    }
  }]);

  return CrossWindow;
}(_react.Component);

exports["default"] = CrossWindow;