import { Component } from 'react';
import getProperty from './utils/getProperty';
import { createChannel } from './channel';

const PROPERTY_NAMESPACE = 'namespace';
const PROPERTY_CHANNEL_PROP_NAME = 'property';
const PROPERTY_CHANNEL_PROP_NAME_DEFAULT = 'channel';
const STATE_PROPERTY_NAME = 'instance';

export default function wrapper(WrappedComponent, options) {
  const namespace = getProperty(options, PROPERTY_NAMESPACE);
  const channelPropertyName = getProperty(
    options,
    PROPERTY_CHANNEL_PROP_NAME,
    PROPERTY_CHANNEL_PROP_NAME_DEFAULT
  );

  return class Connect extends Component {
    static getDerivedStateFromProps(props, state) {
      const resultProps = {
        ...props,
        [channelPropertyName]: state.channel
      };
      const newState = {
        [STATE_PROPERTY_NAME]: new WrappedComponent(resultProps)
      };
      return newState;
    }

    constructor(props) {
      super(props);
      const channel = createChannel(this, namespace);
      const { unsubscribe, ...userChannel } = channel;
      this.unsubscribe = unsubscribe;
      this.state = {
        channel: userChannel,
        component: null,
      };
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    get instance() {
      return this.state[STATE_PROPERTY_NAME];
    }

    render() {
      return this.state[STATE_PROPERTY_NAME];
    }
  };
}
