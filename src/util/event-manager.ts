export class EventManager<E> {
  public events: { [key in keyof E]?: Set<E[key]> };

  public constructor() {
    this.events = {};
  }

  public addEventListener<Key extends keyof E>(eventName: Key, callback: E[Key]): void {
    if (!this.events[eventName]) {
      this.events[eventName] = new Set();
    }

    this.events[eventName].add(callback);
  }

  public removeEventListener<Key extends keyof E>(eventName: Key, callback: E[Key]): void {
    this.events[eventName]?.delete(callback);
  }

  public emit<Key extends keyof E>(eventName: Key, ...args: unknown[]): void {
    if (!(eventName in this.events)) return;

    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      eventCallbacks.forEach((callback) => {
        (callback as (...args: never[]) => void)(...(args as never[]));
      });
    }
  }
}
