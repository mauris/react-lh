import filterIsNot from './utils/filterIsNot';
import { DEFAULT_NAMESPACE } from './utils/constants';

const channels = {};

const appendFunctions = (funcA, funcB) => {
  return (...args) => {
    funcA(...args);
    funcB(...args);
  };
};

export function createChannel(instance = undefined, namespace = DEFAULT_NAMESPACE) {
  if (channels[namespace] === undefined) {
    channels[namespace] = {
      handlers: [],
      store: {}
    };
  }

  const namespaceStore = channels[namespace].store;

  const handlers = {};
  let anyKeyHandlers = [];

  // flags
  let hasRegisteredGlobally = false;
  let hasUnsubscribed = false;

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

  const addChannelSuperHandler = () => {
    if (hasRegisteredGlobally) {
      return;
    }
    const { handlers } = channels[namespace];
    handlers.push([instance, superHandler]);
    hasRegisteredGlobally = true;
  };

  const subscribeInit = (callback) => {
    if (hasUnsubscribed) {
      return;
    }
    addChannelSuperHandler();
    callback();
  };

  const channelObj = {
    store: namespaceStore,

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
