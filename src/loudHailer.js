import React, { Component } from 'react';
import { createChannel } from './channel';

export default function wrapper(WrappedComponent, namespace) {
  return class Connect extends Component {
    constructor(props) {
      super(props);
      this.channel = createChannel(this, namespace);
      const { unsubscribe, ...userChannel } = this.channel;
      this.userChannel = userChannel;
    }

    componentWillUnmount() {
      this.channel.unsubscribe();
    }

    render() {
      const resultProps = {
        ...this.props,
        channel: this.userChannel
      };
      return (
        <WrappedComponent { ...resultProps } />
      );
    }
  };
}
