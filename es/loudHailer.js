"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = wrapper;

var _react = require("react");

var _getProperty = _interopRequireDefault(require("./utils/getProperty"));

var _channel = require("./channel");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PROPERTY_NAMESPACE = 'namespace';
var PROPERTY_CHANNEL_PROP_NAME = 'property';
var PROPERTY_CHANNEL_PROP_NAME_DEFAULT = 'channel';
var STATE_PROPERTY_NAME = 'instance';

function wrapper(WrappedComponent, options) {
  var namespace = (0, _getProperty["default"])(options, PROPERTY_NAMESPACE);
  var channelPropertyName = (0, _getProperty["default"])(options, PROPERTY_CHANNEL_PROP_NAME, PROPERTY_CHANNEL_PROP_NAME_DEFAULT);
  return (
    /*#__PURE__*/
    function (_Component) {
      _inherits(Connect, _Component);

      _createClass(Connect, null, [{
        key: "buildComponentFromProps",
        value: function buildComponentFromProps(props, channel) {
          var resultProps = _objectSpread({}, props, _defineProperty({}, channelPropertyName, channel));

          return new WrappedComponent(resultProps);
        }
      }, {
        key: "getDerivedStateFromProps",
        value: function getDerivedStateFromProps(props, state) {
          var newState = _defineProperty({}, STATE_PROPERTY_NAME, Connect.buildComponentFromProps(props, state.channel));

          return newState;
        }
      }]);

      function Connect(props) {
        var _this;

        _classCallCheck(this, Connect);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Connect).call(this, props));
        var channel = (0, _channel.createChannel)(_assertThisInitialized(_this), namespace);

        var unsubscribe = channel.unsubscribe,
            userChannel = _objectWithoutProperties(channel, ["unsubscribe"]);

        _this.unsubscribe = unsubscribe;
        _this.state = _defineProperty({
          channel: userChannel
        }, STATE_PROPERTY_NAME, Connect.buildComponentFromProps(props, userChannel));
        return _this;
      }

      _createClass(Connect, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.unsubscribe();
        }
      }, {
        key: "getInstance",
        value: function getInstance() {
          return this.state[STATE_PROPERTY_NAME];
        }
      }, {
        key: "render",
        value: function render() {
          return this.state[STATE_PROPERTY_NAME];
        }
      }]);

      return Connect;
    }(_react.Component)
  );
}