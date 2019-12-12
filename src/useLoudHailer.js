import { useEffect } from 'react';
import { createChannel } from './channel';

export default function useLoudHailer(callback, ...args) {
  if (!useEffect) {
    throw new Error(`Effect hook not available in the current version of React installed.
      Please upgrade to at least React v16.8`);
  }
  useEffect(() => {
    // setup
    const channel = createChannel.apply(null, args);

    // execute callback with channel
    callback(channel);

    return () => {
      // clean up
      channel.unsubscribe();
    };
  }, ...args);
}
