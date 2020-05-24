import { useEffect } from 'react';
import useChannel from './useChannel';

function useOnceEvent(event, handler, depsArg = []) {
  const channel = useChannel();
  useEffect(() => {
    // register handler
    let hasFired = false;
    channel.once(event, (...args) => {
      handler(args);
      hasFired = true;
    });

    return () => {
      // clean up
      if (hasFired) {
        return;
      }

      // yet to be fired, remove from channel
      channel.remove(event, handler);
    };
  }, [channel, event, handler, ...depsArg]);
}

export default useOnceEvent;
