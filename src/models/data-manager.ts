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

export interface DataStoreModel {
  publicId: Array<string>;
}

export class DataInstanceInternal {
  private _internalId: number;

  constructor(_newId: number, ...args: any[]) {
    this._internalId = _newId;
  }

  protected get internalId(): number {
    return this._internalId;
  }

  public get publicId(): string {
    return DataInstanceInternal._manager?.getDataValueForInstance(this._internalId, "publicId");
  }
}

export namespace DataInstanceInternal {
  export const _manager: DataManagerClass<
    DataInstance,
    DataInstanceInternal,
    DataStoreModel
  > | null = null;
}

export interface DataManager<Ext, Mod> {
  capacity: number;
  count: number;
  create: () => Ext;
  get: (id: string) => Ext;
  getAll: () => Ext[];
  batchInitializeValue: <K extends keyof Mod>(key: K, array: Mod[K][]) => void;
  batchInitializeEntites: () => void;
}

export class DataManagerClass<Ext, Int extends Ext & DataInstanceInternal, Mod>
  implements DataManager<Ext, Mod>
{
  _create: new (_newId: number) => Int;
  private _dataInstances: Array<Int>;
  //TODO: handle resizing of arrays some how
  private _dataStore: { [key in keyof Mod]: Array<Mod[key] | undefined> } & DataStoreModel;
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

  public getAll(): Ext[] {
    return [...this._dataInstances];
  }

  public getSafe(id: string): Ext | undefined {
    if (!(id in this._publicToInternal)) {
      return undefined;
    }

    return this._dataInstances[this._publicToInternal[id]];
  }

  public getDataValueForInstance(id: number, key: keyof Mod): any {
    return this._dataStore[key][id];
  }

  public setDataValueForInstance<K extends keyof Mod>(id: number, key: K, value: Mod[K]): boolean {
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
}
