import { useEffect, useCallback } from 'react';
import { createChannel } from './channel';

function useLoudHailer(handler, depsArg = [], namespace = undefined) {
  const memoizedHandler = useCallback(handler, depsArg);
  useEffect(() => {
    const channel = createChannel(namespace);

    // execute callback with channel
    const cleanup = memoizedHandler(channel);

    return () => {
      // clean up
      channel.unsubscribe();
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [memoizedHandler]);
}

export default useLoudHailer;
