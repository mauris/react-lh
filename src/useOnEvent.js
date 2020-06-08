import { useEffect, useCallback } from 'react';
import useChannel from './useChannel';

function useOnEvent(event, handler, depsArg = [], namespace = undefined) {
  const channel = useChannel(namespace);
  const memoizedHandler = useCallback(handler, depsArg);
  useEffect(() => {
    // register handler
    channel.on(event, memoizedHandler);

    return () => {
      // clean up
      channel.remove(event, memoizedHandler);
    };
  }, [channel, event, memoizedHandler]);
}

export default useOnEvent;
