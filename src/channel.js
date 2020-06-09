import filterIsNot from './utils/filterIsNot';
import { DEFAULT_NAMESPACE } from './utils/constants';

const channels = {};

const composeFunctions = (funcA, funcB) => {
  return (...args) => {
    funcA(...args);
    funcB(...args);
  };
};

export function createChannel(namespace = DEFAULT_NAMESPACE) {
  if (channels[namespace] === undefined) {
    channels[namespace] = {
      handlers: {},
      store: {}
    };
  }
  const nsChannel = channels[namespace];
  const channelSymbol = Symbol();

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

  const subscribeInit = (callback) => {
    if (hasUnsubscribed) {
      return;
    }
    if (!hasRegisteredGlobally) {
      nsChannel.handlers[channelSymbol] = superHandler;
      hasRegisteredGlobally = true;
    }
    callback();
  };

  const channelObj = {
    store: nsChannel.store,

    on: (key, handler) => {
      subscribeInit(() => {
        if (channelHandlers[key] === undefined) {
          channelHandlers[key] = [];
        }

        channelHandlers[key].push(handler);
      });
    },

    once: (key, handler) => {
      if (hasUnsubscribed) {
        return;
      }
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
      if (hasUnsubscribed) {
        return;
      }
      const wrappedHandler = composeFunctions(handler, () => {
        channelObj.removeAny(wrappedHandler);
      });
      channelObj.onAny(wrappedHandler);
    },

    remove: (key, handler) => {
      if (hasUnsubscribed || channelHandlers[key] === undefined) {
        return;
      }

      channelHandlers[key] = filterIsNot(channelHandlers[key], handler);
    },

    removeAny: (handler) => {
      if (hasUnsubscribed) {
        return;
      }
      anyKeyChannelHandlers = filterIsNot(anyKeyChannelHandlers, handler);
    },

    emit: (key, ...message) => {
      if (hasUnsubscribed) {
        return;
      }
      Object.getOwnPropertySymbols(nsChannel.handlers)
        .map(remoteHandlerSymbol => nsChannel.handlers[remoteHandlerSymbol])
        .filter(handler => Boolean(handler))
        .forEach((handler) => {
          handler(key, message);
        });
    },

    emitAsync: (...args) => {
      if (hasUnsubscribed) {
        return;
      }
      setImmediate(() => {
        channelObj.emit(...args);
      });
    },

    unsubscribe: () => {
      if (hasUnsubscribed) {
        return;
      }
      anyKeyChannelHandlers = [];
      Object.keys(channelHandlers).forEach((key) => {
        delete channelHandlers[key];
      });
      hasUnsubscribed = true;
      if (!hasRegisteredGlobally) {
        return;
      }
      delete nsChannel.handlers[channelSymbol];
    }
  };

  return channelObj;
}
