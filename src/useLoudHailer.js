import { useEffect } from 'react';
import { createChannel } from './channel';

export default function useLoudHailer(callback, depsArg = undefined) {
  useEffect(() => {
    const channel = createChannel();

    // execute callback with channel
    const cleanup = callback(channel);

    return () => {
      // clean up
      channel.unsubscribe();
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [callback, ...depsArg]);
}
