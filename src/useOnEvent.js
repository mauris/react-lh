import { useEffect } from 'react';
import useChannel from './useChannel';

export default function useOnEvent(event, handler, depsArg = undefined) {
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
