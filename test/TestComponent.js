import React from 'react';
import PropTypes from 'prop-types';

function TestComponent(props) {
  const { text, channel, ...otherProps } = props;
  channel.emit('TestComponent:created');
  return (
    <div {...otherProps}>
      {text}
    </div>
  );
}

TestComponent.propTypes = {
  text: PropTypes.string,
  channel: PropTypes.shape({
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired
  }).isRequired
};

TestComponent.defaultProps = {
  text: ''
};

export default TestComponent;
