import { useEffect } from 'react';
import useChannel from './useChannel';

function useOnEvent(event, handler, depsArg = []) {
  const channel = useChannel();
  useEffect(() => {
    // register handler
    channel.on(event, handler);

    return () => {
      // clean up
      channel.remove(event, handler);
    };
  }, [channel, event, handler, ...depsArg]);
}

export default useOnEvent;
