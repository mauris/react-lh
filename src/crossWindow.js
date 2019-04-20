import { Component } from 'react';
import PropTypes from 'prop-types';

import { createChannel } from './channel';
import iterateObject from './utils/iterateObject';

const STORAGE_EVENT_KEY = 'storage';

export default class CrossWindow extends Component {
  static get propTypes() {
    return {
      type: PropTypes.oneOf(['local', 'session']),
      channels: PropTypes.arrayOf(PropTypes.string).isRequired
    };
  }

  static get defaultProps() {
    return {
      type: 'local',
    };
  }

  static getDerivedStateFromProps(props, state) {
    let changes = {};

    const { channels, type } = props;

    if (channels !== state.channels) {
      const tempOldContainer = {
        ...state.channelsContainer
      };

      const storageLocation = `${type}Storage`;

      const newContainer = {};
      channels.forEach((channel) => {
        if (tempOldContainer[channel] === undefined) {
          // new one needs to be created
          const newChannel = createChannel(channel);
          newChannel.onAny((key, ...message) => {
            window[storageLocation].setItem(`lh:${channel}:${key}`, JSON.stringify(message));
          });
          newContainer[channel] = newChannel;
          return;
        }
        // transfer from previous state
        newContainer[channel] = tempOldContainer[channel];
        delete tempOldContainer[channel];
      });

      iterateObject(tempOldContainer)
        .iterate(({ value }) => {
          value.unsubscribe();
        });

      changes = {
        ...changes,
        channels,
        channelsContainer: newContainer
      };
    }

    return changes;
  }

  constructor(props) {
    super(props);

    this.state = {
      channels: [],
      channelsContainer: {}
    };

    this.storageEventHandler = (storageEvent) => {
      const { key } = storageEvent;
      if (!key || !key.startsWith('lh:')) {
        return;
      }
      const { channels, channelsContainer } = this.state;

      channels.forEach((channel) => {
        const channelKey = `lh:${channel}:`;
        if (!key.startsWith(channelKey)) {
          return;
        }
        const messageKey = key.substring(channelKey.length);
        const { newValue } = storageEvent;
        const message = JSON.parse(newValue);
        channelsContainer[channel].emit.apply(null, [key, ...message]);
      });
    };

    window.addEventListener(STORAGE_EVENT_KEY, this.storageEventHandler);
  }

  componentWillUnmount() {
    window.removeEventListener(STORAGE_EVENT_KEY, this.storageEventHandler);
    const { channelsContainer } = this.state;
    iterateObject(channelsContainer)
      .iterate(({ value }) => {
        value.unsubscribe();
      });
  }

  render() {
    const { children } = this.props;
    return children;
  }
}
