import filterIsNot from './utils/filterIsNot';
import { DEFAULT_NAMESPACE } from './utils/constants';

const channels = {};

const composeFunctions = (funcA, funcB) => {
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

  const channelHandlers = {};
  let anyKeyChannelHandlers = [];

  // flags
  let hasRegisteredGlobally = false;
  let hasUnsubscribed = false;

  /*
   * Handler function for this channel to receive
   * all messages broadcasted in the namespace.
   */
  const superHandler = (key, message) => {
    anyKeyChannelHandlers.forEach((handler) => {
      handler(key, ...message);
    });
    if (channelHandlers[key] === undefined) {
      // no handlers
      return;
    }

    channelHandlers[key].forEach((handler) => {
      handler(...message);
    });
  };

  const addChannelSuperHandler = () => {
    if (hasRegisteredGlobally) {
      return;
    }
    channels[namespace].handlers.push([instance, superHandler]);
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
        if (channelHandlers[key] === undefined) {
          channelHandlers[key] = [];
        }

        channelHandlers[key].push(handler);
      });
    },

    once: (key, handler) => {
      const wrappedHandler = composeFunctions(handler, () => {
        // remove once it is fired.
        channelObj.remove(key, wrappedHandler);
      });
      channelObj.on(key, wrappedHandler);
    },

    onAny: (handler) => {
      subscribeInit(() => {
        anyKeyChannelHandlers.push(handler);
      });
    },

    onceAny: (handler) => {
      const wrappedHandler = composeFunctions(handler, () => {
        channelObj.removeAny(wrappedHandler);
      });
      channelObj.onAny(wrappedHandler);
    },

    remove: (key, handler) => {
      if (channelHandlers[key] === undefined) {
        return;
      }

      channelHandlers[key] = filterIsNot(channelHandlers[key], handler);
    },

    removeAny: (handler) => {
      anyKeyChannelHandlers = filterIsNot(anyKeyChannelHandlers, handler);
    },

    emit: (key, ...message) => {
      if (hasUnsubscribed) {
        return;
      }
      channels[namespace].handlers
        .forEach(([, remoteHandler]) => {
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
        channels[namespace].handlers = channels[namespace]
          .handlers
          .filter(n => n[0] !== instance);
      }
      hasUnsubscribed = true;
    }
  };

  return channelObj;
}
