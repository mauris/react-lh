import filterIsNot from './utils/filterIsNot';
import { DEFAULT_NAMESPACE } from './utils/constants';

const channels = {};

export function createChannel(instance = undefined, namespace = DEFAULT_NAMESPACE) {
  if (channels[namespace] === undefined) {
    channels[namespace] = [];
  }

  const handlers = {};
  let anyKeyHandlers = [];

  /*
   * Handler function for this channel to receive
   * all messages broadcasted in the namespace.
   */
  const superHandler = (key, message) => {
    anyKeyHandlers.forEach((handler) => {
      handler(key, ...message);
    });
    if (handlers[key] === undefined) {
      // no handlers
      return;
    }

    handlers[key].forEach((handler) => {
      handler(...message);
    });
  };

  let hasRegisteredGlobally = false;
  const addChannelSuperHandler = () => {
    if (hasRegisteredGlobally) {
      return;
    }
    channels[namespace].push([instance, superHandler]);
    hasRegisteredGlobally = true;
  };

  let hasUnsubscribed = false;

  const subscribeInit = (callback) => {
    if (hasUnsubscribed) {
      return;
    }
    addChannelSuperHandler();
    callback();
  };

  const appendFunctions = (funcA, funcB) => {
    return (...args) => {
      funcA(...args);
      funcB(...args);
    };
  };

  const channelObj = {
    on: (key, handler) => {
      subscribeInit(() => {
        if (handlers[key] === undefined) {
          handlers[key] = [];
        }

        handlers[key].push(handler);
      });
    },

    once: (key, handler) => {
      const wrappedHandler = appendFunctions(handler, () => {
        channelObj.remove(key, wrappedHandler);
      });
      channelObj.on(key, wrappedHandler);
    },

    onAny: (handler) => {
      subscribeInit(() => {
        anyKeyHandlers.push(handler);
      });
    },

    onceAny: (handler) => {
      const wrappedHandler = appendFunctions(handler, () => {
        channelObj.removeAny(wrappedHandler);
      });
      channelObj.onAny(wrappedHandler);
    },

    remove: (key, handler) => {
      if (handlers[key] === undefined) {
        return;
      }

      handlers[key] = filterIsNot(handlers[key], handler);
    },

    removeAny: (handler) => {
      anyKeyHandlers = filterIsNot(anyKeyHandlers, handler);
    },

    emit: (key, ...message) => {
      if (hasUnsubscribed) {
        return;
      }
      channels[namespace].forEach((tuple) => {
        const remoteHandler = tuple[1];
        remoteHandler(key, message);
      });
    },

    emitAsync: (...args) => {
      setTimeout(() => {
        channelObj.emit(...args);
      }, 0);
    },

    unsubscribe: () => {
      if (hasUnsubscribed) {
        return;
      }
      if (hasRegisteredGlobally) {
        channels[namespace] = channels[namespace].filter(n => n[0] !== instance);
      }
      hasUnsubscribed = true;
    }
  };

  return channelObj;
}
