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
 *  const ExampleManagerInternal = new ExampleManagerClass();
 *
 *  namespace ExampleInternal {
 *    export const Manager: ExampleManagerInternal;
 *  }
 *
 *  export const ExampleManager = ExampleManagerInternal as ExampleManager;
 */

import { EntityTypes } from "./types";

// TODO: rename data to entity?

export interface DataInstance {
  type: EntityTypes;
  publicId: string;
}

interface DataStore {
  publicId: string[];
}

export class DataInstanceInternal {
  public static type: EntityTypes = EntityTypes.BASE;
  private _internalId: number;

  constructor(_newId: number, ..._: never[]) {
    this._internalId = _newId;
  }

  protected get internalId(): number {
    return this._internalId;
  }
}

export interface DataManager<Ext, Mod> {
  /** PROPERTIES */
  type: EntityTypes;

  /** META */

  // SERIALIZE
  dumpData: () => string;
  loadData: (content: string) => void;

  // EVENTS
  addEventListener: (eventName: string, callback: DataManagerEventCallback) => void;
  removeEventListener: (eventName: string, callback: DataManagerEventCallback) => void;

  // FETCH
  get: (id: string) => Ext;
  getAll: () => Ext[];
  getAllForProperty: <K extends keyof Ext>(key: K) => Ext[K][];

  // MANAGE
  capacity: number;
  count: number;
  isInitialized: boolean;
  create: () => Ext;
  fullReset: (capacity?: number) => void;
  batchInitializeProperty: <K extends keyof Mod>(key: K, array: Mod[K][]) => void;
  batchInitializeEntities: () => void;
  forEachEntity: <R>(pred: (x: Ext) => R) => void;
  mapEntities: <R>(pred: (x: Ext) => R) => R[];
}

type DataManagerEventCallback = (...args: never[]) => void;

export class DataManagerClass<Ext, Int extends Ext & DataInstanceInternal, Mod>
  implements DataManager<Ext, Mod>
{
  public type: EntityTypes = EntityTypes.BASE;
  private createInstanceCall: new (_newId: number) => Int;
  private dataInstances: Array<Int>;

  //TODO: handle resizing of arrays some how
  private dataStore: { [key in keyof Mod]: Array<Mod[key] | undefined> } & DataStore;
  private currentCapacity: number = 1000;
  private notSerializedProperties: Set<keyof typeof this.dataStore>;

  private publicToInternal: Record<string, number>;

  /** META */
  private events: Record<string, DataManagerEventCallback[]>;
  private isInit: boolean = false;

  public constructor(
    type: new (_newId: number, ...args: never[]) => Int,
    initCapacity?: number,
    excludeProperties?: (keyof typeof this.dataStore)[],
  ) {
    this.createInstanceCall = type;
    this.dataInstances = [];

    this.dataStore = {} as typeof this.dataStore;
    this.currentCapacity = initCapacity ? initCapacity : this.currentCapacity;

    this.publicToInternal = {};
    this.notSerializedProperties = new Set(excludeProperties);

    this.events = {};

    this.isInit = false;

    this.batchInitializePropertyArray("publicId");
  }

  /** SERIALIZE*/

  public dumpData(): string {
    return JSON.stringify(
      Object.fromEntries(
        Object.entries(this.dataStore).filter(
          ([k, _]) => !this.notSerializedProperties.has(k as keyof typeof this.dataStore),
        ),
      ),
    );
  }

  public loadData(content: string) {
    const newStore = JSON.parse(content) as typeof this.dataStore;

    // TODO: do some error checks

    this.fullReset(newStore.publicId.length);
    this.dataStore["publicId"] = [];

    let key: keyof typeof this.dataStore;
    for (key in newStore) {
      this.dataStore[key] = newStore[key];
    }

    this.emit("load");
  }

  /** EVENTS */

  public addEventListener(eventName: string, callback: DataManagerEventCallback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);
  }

  public removeEventListener(eventName: string, callback: DataManagerEventCallback): void {
    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      this.events[eventName] = eventCallbacks.filter((cb) => cb !== callback);
    }
  }

  protected emit(eventName: string, ...args: never[]): void {
    if (!(eventName in this.events)) {
      return;
    }

    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      eventCallbacks.forEach((callback) => {
        callback(...args);
      });
    }
  }

  /** FETCH */

  public get(id: string): Ext {
    if (!(id in this.publicToInternal)) {
      throw new Error("Entity does not exist.");
    }

    return this.dataInstances[this.publicToInternal[id]];
  }

  public getSafe(id: string): Ext | undefined {
    if (!(id in this.publicToInternal)) {
      return undefined;
    }

    return this.dataInstances[this.publicToInternal[id]];
  }

  public getPublicId(id: number): string {
    return this.dataStore["publicId"][id];
  }

  public getAll(): Ext[] {
    return [...this.dataInstances];
  }

  public getAllForProperty<K extends keyof Ext>(key: K): Ext[K][] {
    return this.dataInstances.map((x) => x[key]);
  }

  protected getPropertyForInstance(id: number, key: keyof typeof this.dataStore): never {
    return this.dataStore[key][id];
  }

  /** MANAGE */

  public get capacity(): number {
    return this.currentCapacity;
  }

  public get count(): number {
    return this.dataInstances.length;
  }

  public get isInitialized(): boolean {
    return this.isInit;
  }

  public create(emitStatus: boolean = false): Ext {
    if (this.dataInstances.length >= this.currentCapacity) {
      this.resizeStore();
    }

    const newInstId = this.dataInstances.length;

    // guarantee new & unique id
    let tempId = crypto.randomUUID();
    while (this.publicToInternal[tempId]) tempId = crypto.randomUUID();
    const newInstPublicId = tempId;

    const newInstance = new this.createInstanceCall(newInstId);

    this.dataInstances.push(newInstance);
    this.dataStore.publicId[newInstId] = newInstPublicId;
    this.publicToInternal[newInstPublicId] = newInstId;

    if (emitStatus) {
      this.emit("refresh");
    }

    return newInstance;
  }

  public fullReset(capacity?: number) {
    this.isInit = false;
    this.dataInstances = [];

    this.dataStore = {} as typeof this.dataStore;
    this.currentCapacity = capacity ? capacity : this.currentCapacity;

    this.publicToInternal = {};

    this.batchInitializePropertyArray("publicId");
    this.emit("reset");
  }

  public batchInitializeProperty<K extends keyof Mod>(key: K, array: Mod[K][]) {
    if (this.currentCapacity < array.length) {
      this.resizeStore();
    }

    const newArray = [
      ...array,
      ...new Array<Mod[K]>(Math.min(this.currentCapacity - array.length, 0)),
    ];
    this.dataStore = { ...this.dataStore, [key]: newArray };
    this.emit("refresh");
  }

  public batchInitializeEntities(): void {
    if (this.isInit) {
      throw new Error("Entities already exist!");
    }

    for (let index = 0; index < this.currentCapacity; index++) {
      this.create(false);
    }

    this.isInit = true;
    this.emit("refresh");
  }

  public forEachEntity<R>(pred: (x: Ext) => R) {
    this.dataInstances.forEach(pred);
  }

  public mapEntities<R>(pred: (x: Ext) => R): R[] {
    return this.dataInstances.map(pred);
  }

  private resizeStore(_number?: number): void {
    throw new Error("Method not implemented yet. Need to allocate more space to create entities.");
  }

  protected setPropertyForInstance<K extends keyof typeof this.dataStore>(
    id: number,
    key: K,
    value: (typeof this.dataStore)[K][number],
    emitStatus: boolean = false,
  ): boolean {
    // TODO: do some checks to allow assignment
    // TODO: throw some exceptions?

    this.dataStore[key][id] = value;
    if (emitStatus) {
      this.emit("refresh");
    }

    return true;
  }

  protected batchInitializePropertyArray<K extends keyof typeof this.dataStore>(key: K) {
    this.dataStore = {
      ...this.dataStore,
      [key]: new Array<(typeof this.dataStore)[K]>(this.currentCapacity),
    };
    this.emit("refresh");
  }
}

export namespace Base {
  export type EntityType = DataInstance;
  export type ManagerType<Ext, Mod> = DataManager<Ext, Mod>;
}
