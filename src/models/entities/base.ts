import memoize from "fast-memoize";
import { EntityTypes } from "./types";
import assert from "assert";

interface EntityDataStore {
  publicId: string[];
}

// TODO:

export class Entity {
  public static readonly type: EntityTypes = EntityTypes.BASE;

  protected _manager: EntityManager<unknown, Entity>;
  protected readonly _internalId: number;

  constructor(manager: unknown, newId: number, ..._: never[]) {
    assert(manager instanceof EntityManager);
    this._manager = manager;
    this._internalId = newId;
  }

  public get internalId(): number {
    return this._internalId;
  }

  private __getMemoPublicId = memoize(() => {
    return this._manager._getPublicId(this._internalId);
  });

  public get id(): string {
    return this.__getMemoPublicId();
  }
}

type EntityManagerEventCallback = (...args: never[]) => void;

export class EntityManager<Attributes, Inst extends Entity> {
  public type: EntityTypes = EntityTypes.BASE;

  private createInstanceCall: new (manager: unknown, newId: number, ...args: never[]) => Inst;
  private entities: Array<Inst>;

  //TODO: handle resizing of arrays some how
  protected dataStore: {
    [key in keyof Attributes]: Array<Attributes[key] | undefined>;
  } & EntityDataStore;
  private currentCapacity: number = 1000;
  private publicToInternal: Record<string, number>;

  private defaultAttributeValues: {
    [key in keyof Attributes]: { value?: Attributes[key]; generator?: () => Attributes[key] };
  };
  private notSerializedAttributes: Set<keyof typeof this.dataStore>;

  /** META */
  private events: Record<string, Set<EntityManagerEventCallback>>;
  private isInit: boolean = false;

  public constructor(
    entityType: typeof this.createInstanceCall,
    defaultAttributes: typeof this.defaultAttributeValues,
    initCapacity?: number,
    excludeAttributes?: (keyof typeof this.dataStore)[],
  ) {
    this.createInstanceCall = entityType;

    this.defaultAttributeValues = defaultAttributes;
    this.notSerializedAttributes = new Set(excludeAttributes);

    this.events = {};

    this.entities = [];
    this.dataStore = {} as typeof this.dataStore;
    this.currentCapacity = initCapacity ? initCapacity : this.currentCapacity;
    this.publicToInternal = {};

    this.resetAttributesForAll();
  }

  /** SERIALIZE*/

  public dump(): string {
    return JSON.stringify(
      Object.fromEntries(
        Object.entries(this.dataStore).filter(
          ([k, _]) => !this.notSerializedAttributes.has(k as keyof typeof this.dataStore),
        ),
      ),
    );
  }

  public load(content: string) {
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

  public addEventListener(eventName: string, callback: EntityManagerEventCallback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = new Set();
    }

    this.events[eventName].add(callback);
  }

  public removeEventListener(eventName: string, callback: EntityManagerEventCallback): void {
    this.events[eventName].delete(callback);
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

  /** GET */

  public get(id: string): Inst {
    if (!(id in this.publicToInternal)) {
      throw new Error("Entity does not exist.");
    }

    return this.entities[this.publicToInternal[id]];
  }

  public getSafe(id: string): Inst | undefined {
    if (!(id in this.publicToInternal)) {
      return undefined;
    }

    return this.entities[this.publicToInternal[id]];
  }

  public _getPublicId(id: number): string {
    return this.dataStore["publicId"][id];
  }

  public getAll(): Inst[] {
    return [...this.entities];
  }

  public getAllForAttribute<K extends keyof typeof this.dataStore>(
    key: K,
  ): (typeof this.dataStore)[K][number][] {
    const array = this.dataStore[key];
    return [...array];
  }

  public getAttributeFor<K extends keyof typeof this.dataStore>(
    id: number,
    key: K,
  ): (typeof this.dataStore)[K][number] {
    return this.dataStore[key][id];
  }

  /** SET **/

  public setAttributeForAll<K extends keyof typeof this.dataStore>(
    key: K,
    value?: (typeof this.dataStore)[K][number],
    generator?: () => (typeof this.dataStore)[K][number],
  ) {
    const newAttributeArray = new Array<(typeof this.dataStore)[K]>(this.currentCapacity);

    this.dataStore = {
      ...this.dataStore,
      [key]: newAttributeArray.map((x) => (generator ? generator() : value || x)),
    };
    this.emit("refresh");
  }

  public setAttributePer<K extends keyof typeof this.dataStore>(
    key: K,
    array: (typeof this.dataStore)[K][number][],
  ) {
    if (this.currentCapacity < array.length) {
      this.resizeStore();
    }

    const newArray = [
      ...array,
      ...new Array<(typeof this.dataStore)[K][number]>(
        Math.min(this.currentCapacity - array.length, 0),
      ),
    ];
    this.dataStore = { ...this.dataStore, [key]: newArray };
    this.emit("refresh");
  }

  public setAttributeFor<K extends keyof typeof this.dataStore>(
    id: number,
    key: K,
    value: (typeof this.dataStore)[K][number],
  ): boolean {
    // TODO: do some checks to allow assignment
    // TODO: throw some exceptions?

    this.dataStore[key][id] = value;
    this.emit("refresh");

    return true;
  }

  public resetAttributeForAll<K extends keyof typeof this.dataStore>(key: K) {
    if (key === "publicId") {
      throw new Error("Cannot reset all ids!");
    } else {
      const { value, generator } = this.defaultAttributeValues[key as keyof Attributes];
      this.setAttributeForAll(key, value, generator);
    }
    this.emit("refresh");
  }

  public resetAttributesForAll() {
    this.resetAttributeForAll("publicId");
    Object.keys(this.defaultAttributeValues).forEach((key) =>
      this.setAttributeForAll(key as keyof Attributes),
    );
  }

  /** ITERATE */

  public forEachEntity<R>(pred: (x: Inst) => R) {
    this.entities.forEach(pred);
  }

  public mapEntities<R>(pred: (x: Inst) => R): R[] {
    return this.entities.map(pred);
  }

  /** MANAGE */

  public get capacity(): number {
    return this.currentCapacity;
  }

  public get count(): number {
    return this.entities.length;
  }

  public get isInitialized(): boolean {
    return this.isInit;
  }

  public create(): Inst {
    if (this.entities.length >= this.currentCapacity) {
      this.resizeStore();
    }

    const newInstId = this.entities.length;

    // guarantee new & unique id
    let tempId = crypto.randomUUID();
    while (this.publicToInternal[tempId]) tempId = crypto.randomUUID();
    const newInstPublicId = tempId;

    const newInstance = new this.createInstanceCall(this, newInstId);

    this.entities.push(newInstance);
    this.dataStore.publicId[newInstId] = newInstPublicId;
    this.publicToInternal[newInstPublicId] = newInstId;

    this.emit("refresh");

    return newInstance;
  }

  public initializeEntities(): void {
    if (this.isInit) {
      throw new Error("Entities already exist!");
    }

    for (let index = 0; index < this.currentCapacity; index++) {
      this.create();
    }

    this.isInit = true;
    this.emit("refresh");
  }

  private resizeStore(_number?: number): void {
    throw new Error("Method not implemented yet. Need to allocate more space to create entities.");
  }

  public fullReset(capacity?: number) {
    this.isInit = false;

    this.entities = [];
    this.dataStore = {} as typeof this.dataStore;
    this.currentCapacity = capacity ? capacity : this.currentCapacity;
    this.publicToInternal = {};

    this.resetAttributesForAll();
    this.emit("reset");
  }
}
