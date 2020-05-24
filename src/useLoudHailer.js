import { useEffect } from 'react';
import { createChannel } from './channel';

function useLoudHailer(callback, depsArg = []) {
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

export default useLoudHailer;
