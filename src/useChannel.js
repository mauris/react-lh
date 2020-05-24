import { useMemo } from 'react';
import { createChannel } from './channel';

function useChannel(...args) {
  return useMemo(() => createChannel(...args), args);
}

export default useChannel;
