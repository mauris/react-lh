import { useEffect } from 'react';
import { createChannel } from './channel';

export default function useLoudHailer(callback, depsArg = undefined) {
  if (!useEffect) {
    throw new Error(`Effect hook not available in the current version of React installed.
      Please upgrade to at least React v16.8`);
  }
  useEffect(() => {
    // setup
    const channel = createChannel();

    // execute callback with channel
    callback(channel);

    return () => {
      // clean up
      channel.unsubscribe();
    };
  }, depsArg);
}
