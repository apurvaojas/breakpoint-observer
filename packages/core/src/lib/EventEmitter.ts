import EventEmitterNode from 'eventemitter3';

type eventTypes = string | symbol;

type callbackArgumentType = unknown[];

type ListnerType = (...args: callbackArgumentType) => void;

interface EventEmitterEvents {
  [eventNames: eventTypes]: callbackArgumentType;
}

export abstract class EventEmitter<
  T extends EventEmitterEvents
> extends EventEmitterNode {
  constructor() {
    super();

    // do stuff here
  }
  override addListener<K extends keyof T = eventTypes>(
    event: K,
    listener: (...args: T[Extract<keyof T, K>]) => void
  ) {
    // do stuff here
    return super.addListener(event as eventTypes, listener as ListnerType);
  }
  override on<K extends keyof T = eventTypes>(
    event: K,
    listener: (...args: T[Extract<keyof T, K>]) => void
  ) {
    // do stuff here
    return super.on(event as eventTypes, listener as ListnerType);
  }

  override emit<K extends keyof T = eventTypes>(
    eventName: K,
    ...args: T[Extract<keyof T, K>]
  ): boolean {
    return super.emit(eventName as eventTypes, ...args);
  }
}
