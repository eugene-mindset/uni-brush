/**
 * General idea is that certain data related to star systems has a couple of constraints
 * - Needs to vectorized for efficient rendering purposes
 * - Easily load from and dump data into serializable data formats
 * - Not easily modifiable to where the logic no longer works
 *
 * ---- Example DataManager
 *
 *  export interface Example {
 *    amount: number;
 *  }
 *
 *  class ExampleInternal extends DataInstanceInternal implements Example {
 *    ...
 *    get value(): number {
 *      return ExampleInternal.Manager.getValue(this.internalId);
 *    }
 *    ...
 *  }
 *
 *  class ExampleManagerClass extends DataManagerClass<
 *    Example,
 *    ExampleInternal,
 *    { values: number }
 *  > {
 *
 *    constructor() {
 *      super(ExampleManagerClass);
 *    }
 *
 *    public getValue(_id: number): number {
 *      return this._dataStore.values[number]
 *    }
 *
 *    ...
 *  }
 *
 *  export type ExampleManager = DataManager<Example>;
 *
 *  sonst ExampleManagerInternal = new ExampleManagerClass();
 *
 *  namespace ExampleInternal {
 *    export const Manager: ExampleManagerInternal;
 *  }
 *
 *  export const ExampleManager = ExampleManagerInternal as ExampleManager;
 */

export interface DataInstance {
  publicId: string;
}

interface DataStore {
  publicId: string[];
}

export class DataInstanceInternal {
  private _internalId: number;

  constructor(_newId: number, ...args: any[]) {
    this._internalId = _newId;
  }

  protected get internalId(): number {
    return this._internalId;
  }
}

export interface DataManager<Ext, Mod> {
  capacity: number;
  count: number;

  create: () => Ext;

  get: (id: string) => Ext;
  getAll: () => Ext[];

  fullReset: (capacity?: number) => void;
  batchInitializeValue: <K extends keyof Mod>(key: K, array: Mod[K][]) => void;
  batchInitializeEntites: () => void;
  dumpData: () => string;
  loadData: (content: string) => void;

  subscribe: (eventName: string, callback: DataManagerEventCallback) => void;
  unsubscribe: (eventName: string, callback: DataManagerEventCallback) => void;
}

type DataManagerEventCallback = (...args: any[]) => void;

export class DataManagerClass<Ext, Int extends Ext & DataInstanceInternal, Mod>
  implements DataManager<Ext, Mod>
{
  private createInstanceCall: new (_newId: number) => Int;
  private dataInstances: Array<Int>;
  //TODO: handle resizing of arrays some how
  private dataStore: { [key in keyof Mod]: Array<Mod[key] | undefined> } & DataStore;
  private currentCapacity: number = 1000;

  private publicToInternal: Record<string, number> = {};

  /** META */
  private events: Record<string, DataManagerEventCallback[]>;

  public constructor(type: new (_newId: number, ...args: any[]) => Int, initCapacity?: number) {
    this.createInstanceCall = type;
    this.dataInstances = [];

    this.dataStore = {} as typeof this.dataStore;
    this.currentCapacity = initCapacity ? initCapacity : this.currentCapacity;
    this.batchInitializeProperty("publicId");

    this.events = {};
  }

  public fullReset(capacity?: number) {
    this.dataInstances = [];
    this.dataStore = {} as typeof this.dataStore;
    this.currentCapacity = capacity ? capacity : this.currentCapacity;
    this.batchInitializeProperty("publicId");
  }

  public get capacity(): number {
    return this.currentCapacity;
  }

  public get count(): number {
    return this.dataInstances.length;
  }

  private resizeStore(alloc?: number): void {
    throw new Error("Method not implemented yet. Need to allocate more space to create entities.");
  }

  public create(): Ext {
    if (this.dataInstances.length >= this.currentCapacity) {
      this.resizeStore();
    }

    const newInstId = this.dataInstances.length;
    const newInstPublicId = crypto.randomUUID();
    const newInstance = new this.createInstanceCall(newInstId);

    this.dataInstances.push(newInstance);
    this.dataStore.publicId[newInstId] = newInstPublicId;
    this.publicToInternal[newInstPublicId] = newInstId;

    return newInstance;
  }

  public get(id: string): Ext {
    if (!(id in this.publicToInternal)) {
      throw new Error("Entity does not exist.");
    }

    return this.dataInstances[this.publicToInternal[id]];
  }

  public getPublicId(id: number): string {
    return this.dataStore["publicId"][id];
  }

  public getAll(): Ext[] {
    return [...this.dataInstances];
  }

  public getSafe(id: string): Ext | undefined {
    if (!(id in this.publicToInternal)) {
      return undefined;
    }

    return this.dataInstances[this.publicToInternal[id]];
  }

  public getDataValueForInstance(id: number, key: keyof typeof this.dataStore): any {
    return this.dataStore[key][id];
  }

  public setDataValueForInstance<K extends keyof typeof this.dataStore>(
    id: number,
    key: K,
    value: (typeof this.dataStore)[K][number]
  ): boolean {
    // TODO: do some checks to allow assignment
    // TODO: throw some exceptions?

    this.dataStore[key][id] = value;

    return true;
  }

  protected batchInitializeProperty<K extends keyof typeof this.dataStore>(key: K) {
    this.dataStore = {
      ...this.dataStore,
      [key]: new Array<(typeof this.dataStore)[K]>(this.currentCapacity),
    };
  }

  public batchInitializeValue<K extends keyof Mod>(key: K, array: Mod[K][]) {
    if (this.currentCapacity < array.length) {
      this.resizeStore();
    }

    const newArray = [
      ...array,
      ...new Array<Mod[K]>(Math.min(this.currentCapacity - array.length, 0)),
    ];
    this.dataStore = { ...this.dataStore, [key]: newArray };
  }

  public batchInitializeEntites(): void {
    if (this.dataInstances.length) {
      throw new Error("Entities alreaedy exist!");
    }

    for (let index = 0; index < this.currentCapacity; index++) {
      this.create();
    }
  }

  /** SERIALIZATION */

  public dumpData(): string {
    return JSON.stringify(this.dataStore);
  }

  public loadData(content: string) {
    const newStore = JSON.parse(content) as typeof this.dataStore;

    // TODO: do some error checks

    this.fullReset();
    this.dataStore["publicId"] = [];

    let key: keyof typeof this.dataStore;
    for (key in newStore) {
      this.dataStore[key] = newStore[key];
    }

    this.emit("refresh");
  }

  /** EVENTS */

  public subscribe(eventName: string, callback: DataManagerEventCallback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  public unsubscribe(eventName: string, callback: DataManagerEventCallback): void {
    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      this.events[eventName] = eventCallbacks.filter((cb) => cb !== callback);
    }
  }

  protected emit(eventName: string, ...args: any[]): void {
    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      eventCallbacks.forEach((callback) => {
        callback(...args);
      });
    }
  }
}
