import { EntityTypes } from "./types";
import assert from "assert";

interface EntityDataStore {
  publicId: string[];
}

/**
 *
 */
export class Entity {
  /** What type of entity is this instance */
  public static readonly type: EntityTypes = EntityTypes.BASE;

  /** Manager the instance associates with */
  protected _manager: EntityManager<unknown, Entity>;
  /** Internal id associating the instance to a specific entity within the Manager  */
  protected readonly _index: number;

  /**
   * Construct a new Entity
   * @param manager Manager the Entity originates from
   * @param newId Id associating the Entity to a specific entity within the Manager
   * @param _ Other arguments...
   * @throws Will ensure manager is indeed an EntityManager or it will error
   */
  constructor(manager: unknown, newId: number) {
    assert(
      manager instanceof EntityManager,
      new Error("Cannot create instance without manager being an EntityManager"),
    );
    this._manager = manager;
    this._index = newId;
  }

  /** Id of instance */
  public get id(): string {
    return this._manager.__getPublicId(this._index);
  }

  public get isWeakReference(): boolean {
    return !this._manager.__verifyEntity(this._index, this);
  }
}

type EntityManagerEventCallback = (...args: never[]) => void;

/**
 *
 */
export class EntityManager<Attributes, Inst extends Entity> {
  public type: EntityTypes = EntityTypes.BASE;

  /** Method to create new Entities */
  private createInstanceCall: new (manager: unknown, newId: number, ...args: never[]) => Inst;
  /** Created entities that are directly managed */
  private entities: Array<Inst>;

  //TODO: handle resizing of arrays some how
  /**
   * Data that is the actual values for attributes for entities
   *
   * Each key in the object corresponds to a key in the Attributes generic type. The value is an
   * array where each index corresponds to an entity and the value at that index is the value of
   * that attribute for that entity.
   *
   * {
   *    ...,
   *    [ Attribute ] = [ Value, Value, ... , Value, Value ],
   *    ...
   * }
   */
  protected dataStore: {
    [key in keyof Attributes]: Array<Attributes[key] | undefined>;
  } & EntityDataStore;
  /** Amount of unique entities to allocate for */
  private currentCapacity: number = 1000;
  /** Mapping of entities' public id to their corresponding index */
  private publicToIndex: Record<string, number>;
  /** The default values to grant for each entity's attributes */
  private defaultAttributeValues: {
    [key in keyof Attributes]: { value?: Attributes[key]; generator?: () => Attributes[key] };
  };
  /** Attributes to not including when serializing or deserializing entities */
  private notSerializedAttributes: Set<keyof typeof this.dataStore>;

  /** META */

  /** Events to track and the callbacks to trigger when they occur */
  private events: Record<string, Set<EntityManagerEventCallback>>;
  /** If true, model cannot create new entities */
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
    this.publicToIndex = {};

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
    if (!(id in this.publicToIndex)) {
      throw new Error("Entity does not exist.");
    }

    return this.entities[this.publicToIndex[id]];
  }

  public getSafe(id: string): Inst | undefined {
    if (!(id in this.publicToIndex)) {
      return undefined;
    }

    return this.entities[this.publicToIndex[id]];
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

  public __getPublicId(index: number): string {
    return this.dataStore["publicId"][index];
  }

  public __verifyEntity(index: number, entity: Inst): boolean {
    return this.entities[index] === entity;
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
    if (this.isInit) {
      throw new Error("Entities already exist!");
    }

    if (this.entities.length >= this.currentCapacity) {
      this.resizeStore();
    }

    const newInstId = this.entities.length;

    // guarantee new & unique id
    let tempId = crypto.randomUUID();
    while (this.publicToIndex[tempId]) tempId = crypto.randomUUID();
    const newInstPublicId = tempId;

    const newInstance = new this.createInstanceCall(this, newInstId);

    this.entities.push(newInstance);
    this.dataStore.publicId[newInstId] = newInstPublicId;
    this.publicToIndex[newInstPublicId] = newInstId;

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
    this.publicToIndex = {};

    this.resetAttributesForAll();
    this.emit("reset");
  }
}
