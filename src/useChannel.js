import { useMemo } from 'react';
import { createChannel } from './channel';

export default function useChannel(...args) {
  return useMemo(() => createChannel(...args), args);
}
