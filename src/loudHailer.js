import React, { Component } from 'react';
import getProperty from './utils/getProperty';
import { createChannel } from './channel';

const PROPERTY_NAMESPACE = 'namespace';
const PROPERTY_CHANNEL_PROP_NAME = 'property';
const PROPERTY_CHANNEL_PROP_NAME_DEFAULT = 'channel';

export default function wrapper(WrappedComponent, options) {
  const namespace = getProperty(options, PROPERTY_NAMESPACE);
  const channelPropertyName = getProperty(
    options,
    PROPERTY_CHANNEL_PROP_NAME,
    PROPERTY_CHANNEL_PROP_NAME_DEFAULT
  );

  return class Connect extends Component {
    constructor(props) {
      super(props);
      const channel = createChannel(this, namespace);
      const { unsubscribe, ...userChannel } = channel;
      this.userChannel = userChannel;
      this.unsubscribe = unsubscribe;
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      const resultProps = {
        ...this.props,
        [channelPropertyName]: this.userChannel
      };
      return (
        <WrappedComponent { ...resultProps } />
      );
    }
  };
}
