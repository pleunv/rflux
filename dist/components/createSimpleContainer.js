'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ContainerHelpers = require('../internal/ContainerHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * If a prop is an observable, create a listener and pass the observed values as props.
 * Otherwise, pass the prop into the child component, which must be a stateless functional component.
 *
 * The use case is when you don't need access to other parts of the state.
 *
 * @param getInitialState - the default container state
 * @param getObservableState - passed to child container as props
 * @param containerDefaults - default props and propTypes of parent container
 * @returns {Function}
 */
function createContainer(_ref) {
  var _ref$getInitialState = _ref.getInitialState;

  var _getInitialState = _ref$getInitialState === undefined ? function () {
    return {};
  } : _ref$getInitialState;

  var _ref$getObservableSta = _ref.getObservableState;
  var getObservableState = _ref$getObservableSta === undefined ? function () {
    return {};
  } : _ref$getObservableSta;
  var _ref$containerDefault = _ref.containerDefaults;
  var containerDefaults = _ref$containerDefault === undefined ? {} : _ref$containerDefault;
  var _containerDefaults$pr = containerDefaults.propTypes;
  var propTypes = _containerDefaults$pr === undefined ? {} : _containerDefaults$pr;
  var _containerDefaults$ge = containerDefaults.getDefaultProps;

  var _getDefaultProps = _containerDefaults$ge === undefined ? function () {
    return undefined;
  } : _containerDefaults$ge;

  return function (StatelessFunctionalComponent) {
    return _react2.default.createClass({

      propTypes: propTypes,

      getInitialState: function getInitialState() {
        return _getInitialState.call(this);
      },
      getDefaultProps: function getDefaultProps() {
        return _getDefaultProps();
      },
      componentWillMount: function componentWillMount() {

        var observableState = getObservableState.call(this);
        var nonObservableState = nonObservableState(observableState);

        if (Object.keys(nonObservableState).length) {
          console.warn('Passed non-observable state in #getObservableState. Use #getInitialState. ' + ('It will have no effect: ' + nonObservableState));
        }

        this._observableState = observableState(observableState);
        this._callbacks = (0, _ContainerHelpers.setupObservableState)(this, this._observableState);
      },
      componentWillUnmount: function componentWillUnmount() {

        (0, _ContainerHelpers.removeObservableState)(this._observableState, this._callbacks);
      },
      render: function render() {
        return _react2.default.createElement(StatelessFunctionalComponent, _extends({}, this.state, this.props));
      }
    });
  };
}
exports.default = createContainer;
//# sourceMappingURL=createSimpleContainer.js.map
