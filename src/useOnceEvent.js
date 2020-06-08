import { useEffect, useCallback } from 'react';
import useChannel from './useChannel';

function useOnceEvent(event, handler, depsArg = [], namespace = undefined) {
  const channel = useChannel(namespace);
  const memoizedHandler = useCallback(handler, depsArg);
  useEffect(() => {
    // register handler
    let hasFired = false;
    const internalHandler = (...args) => {
      memoizedHandler(args);
      hasFired = true;
    };
    channel.once(event, internalHandler);

    return () => {
      // clean up
      if (hasFired) {
        return;
      }

      // yet to be fired, remove from channel
      channel.remove(event, internalHandler);
    };
  }, [channel, event, memoizedHandler]);
}

export default useOnceEvent;
