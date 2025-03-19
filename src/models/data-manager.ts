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

import { Buffer } from "node:buffer";

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
}

export class DataManagerClass<Ext, Int extends Ext & DataInstanceInternal, Mod>
  implements DataManager<Ext, Mod>
{
  _create: new (_newId: number) => Int;
  private _dataInstances: Array<Int>;
  //TODO: handle resizing of arrays some how
  private _dataStore: { [key in keyof Mod]: Array<Mod[key] | undefined> } & DataStore;
  private _capacity: number = 1000;

  private _publicToInternal: Record<string, number> = {};

  public constructor(type: new (_newId: number, ...args: any[]) => Int, initCapacity?: number) {
    this._create = type;
    this._dataInstances = [];

    this._dataStore = {} as typeof this._dataStore;
    this._capacity = initCapacity ? initCapacity : this._capacity;
    this.batchInitializeProperty("publicId");
  }

  public get capacity(): number {
    return this._capacity;
  }

  public get count(): number {
    return this._dataInstances.length;
  }

  private resizeStore(alloc?: number): void {
    throw new Error("Method not implemented yet. Need to allocate more space to create entities.");
  }

  public create(): Ext {
    if (this._dataInstances.length >= this._capacity) {
      this.resizeStore();
    }

    const newInstId = this._dataInstances.length;
    const newInstPublicId = crypto.randomUUID();
    const newInstance = new this._create(newInstId);

    this._dataInstances.push(newInstance);
    this._dataStore.publicId[newInstId] = newInstPublicId;
    this._publicToInternal[newInstPublicId] = newInstId;

    return newInstance;
  }

  public get(id: string): Ext {
    if (!(id in this._publicToInternal)) {
      throw new Error("Entity does not exist.");
    }

    return this._dataInstances[this._publicToInternal[id]];
  }

  public getPublicId(id: number): string {
    return this._dataStore["publicId"][id];
  }

  public getAll(): Ext[] {
    return [...this._dataInstances];
  }

  public getSafe(id: string): Ext | undefined {
    if (!(id in this._publicToInternal)) {
      return undefined;
    }

    return this._dataInstances[this._publicToInternal[id]];
  }

  public fullReset(capacity?: number) {
    this._dataInstances = [];
    this._dataStore = {} as typeof this._dataStore;
    this._capacity = capacity ? capacity : this._capacity;
    this.batchInitializeProperty("publicId");
  }

  public getDataValueForInstance(id: number, key: keyof typeof this._dataStore): any {
    return this._dataStore[key][id];
  }

  public setDataValueForInstance<K extends keyof typeof this._dataStore>(
    id: number,
    key: K,
    value: (typeof this._dataStore)[K][number]
  ): boolean {
    // TODO: do some checks to allow assignment
    // TODO: throw some exceptions?

    this._dataStore[key][id] = value;

    return true;
  }

  protected batchInitializeProperty<K extends keyof typeof this._dataStore>(key: K) {
    this._dataStore = {
      ...this._dataStore,
      [key]: new Array<(typeof this._dataStore)[K]>(this._capacity),
    };
  }

  public batchInitializeValue<K extends keyof Mod>(key: K, array: Mod[K][]) {
    if (this._capacity < array.length) {
      this.resizeStore();
    }

    const newArray = [...array, ...new Array<Mod[K]>(Math.min(this._capacity - array.length, 0))];
    this._dataStore = { ...this._dataStore, [key]: newArray };
  }

  public batchInitializeEntites(): void {
    if (this._dataInstances.length) {
      throw new Error("Entities alreaedy exist!");
    }

    for (let index = 0; index < this._capacity; index++) {
      this.create();
    }
  }

  public dumpData(): string {
    return JSON.stringify(this._dataStore);
  }

  public loadData(content: string) {
    const newStore = JSON.parse(content) as typeof this._dataStore;

    // TODO: do some error checks

    this.fullReset();
    this._dataStore["publicId"] = [];

    let key: keyof typeof this._dataStore;
    for (key in newStore) {
      this._dataStore[key] = newStore[key];
    }
  }
}
