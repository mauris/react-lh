import filterIsNot from './utils/filterIsNot';

const channels = {};

export function createChannel(instance, namespaceArg) {
  let namespace = namespaceArg;
  if (namespace === undefined) {
    namespace = 'default';
  }

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

  return {
    on: (key, handler) => {
      if (hasUnsubscribed) {
        return;
      }
      addChannelSuperHandler();
      if (handlers[key] === undefined) {
        handlers[key] = [];
      }

      handlers[key].push(handler);
    },

    onAny: (handler) => {
      if (hasUnsubscribed) {
        return;
      }
      anyKeyHandlers.push(handler);
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

    unsubscribe: () => {
      if (hasRegisteredGlobally) {
        channels[namespace] = channels[namespace].filter(n => n[0] !== instance);
      }
      hasUnsubscribed = true;
    }
  };
}
