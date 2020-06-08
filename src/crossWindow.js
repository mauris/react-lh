import { Component } from 'react';
import PropTypes from 'prop-types';

import { createChannel } from './channel';
import iterateObject from './utils/iterateObject';
import { DEFAULT_NAMESPACE } from './utils/constants';

const STORAGE_EVENT_KEY = 'storage';
const STORAGE_LOCATION = window.localStorage;

class CrossWindow extends Component {
  static get propTypes() {
    return {
      channels: PropTypes.arrayOf(PropTypes.string),
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
      ])
    };
  }

  static get defaultProps() {
    return {
      channels: [DEFAULT_NAMESPACE],
      children: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    let changes = {};

    const { channels } = props;

    if (channels !== state.channels) {
      const tempOldContainer = {
        ...state.channelsContainer
      };

      const newContainer = {};
      channels.forEach((channel) => {
        if (tempOldContainer[channel] === undefined) {
          // new one needs to be created
          const newChannel = createChannel(channel);
          newChannel.onAny((key, ...message) => {
            STORAGE_LOCATION.setItem(`lh:${channel}`, JSON.stringify({ key, message }));
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

    // handler stored as reference for unmounting
    this.storageEventHandler = (storageEvent) => {
      const eventKey = storageEvent.key;
      if (!eventKey || !eventKey.startsWith('lh:')) {
        return;
      }

      if (storageEvent.storageArea !== STORAGE_LOCATION) {
        // mismatched storage location
        return;
      }

      const { channels, channelsContainer } = this.state;

      channels.forEach((channel) => {
        const channelKey = `lh:${channel}`;
        if (eventKey !== channelKey) {
          return;
        }
        const { newValue } = storageEvent;
        const { key, message } = JSON.parse(newValue);
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

export default CrossWindow;
