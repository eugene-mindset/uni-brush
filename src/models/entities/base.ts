import { EventManager } from "@/util";

import { EntityTypes } from "./types";

interface EntityDataStore {
  publicId: string[];
}

export interface EventsToCallbackBase {
  load: () => void;
  refresh: (who: string) => void;
  set_entity: (who: string, what: string) => void;
  set_all_attr: (what: string) => void;
  set_per_attr: (what: string) => void;
  reset_entity_attr: (who: string, what: string) => void;
  reset_entity: (who: string) => void;
  reset_all_attr: (what: string) => void;
  reset_all: () => void;
  create_entity: (who: string) => void;
  create_all: () => void;
  create_reset: () => void;
  reset: () => void;
}

/**
 *
 */
export class EntityBase<Attributes extends object> {
  /** What type of entity is this instance */
  public static readonly type: EntityTypes = EntityTypes.BASE;
  public readonly type = EntityBase.type;

  /** Manager the instance associates with */
  protected _manager: ManagerBase<Attributes, EntityBase<Attributes>, EventsToCallbackBase>;
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
    if (!(manager instanceof ManagerBase)) {
      throw new Error("Cannot create instance without manager being StarSystemManager");
    }

    this._manager = manager;
    this._index = newId;
  }

  /** Id of instance */
  public get id(): string {
    return this._manager.getAttribute("publicId", this._index);
  }

  public get isWeakReference(): boolean {
    return !this._manager.__verifyEntity(this._index, this);
  }
}

/**
 *
 */
export class ManagerBase<
  Attributes extends object,
  Inst extends EntityBase<Attributes>,
  Events extends EventsToCallbackBase,
> {
  public static readonly type: EntityTypes = EntityTypes.BASE;
  public readonly type: EntityTypes = EntityTypes.BASE;

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
  private idToIndex: Record<string, number>;
  /** The default values to grant for each entity's attributes */
  private defaultAttributeValues: {
    [key in keyof Attributes]: {
      value?: Attributes[key];
      generator?: () => Attributes[key];
    };
  };
  /** Attributes to not including when serializing or deserializing entities */
  private notSerializedAttributes: Set<keyof Attributes>;

  // META

  /** Events to track and the callbacks to trigger when they occur */
  private eventManager: EventManager<Events>;

  /** If true, model cannot create new entities */
  private isInit: boolean = false;

  public constructor(
    entityType: typeof this.createInstanceCall,
    defaultAttributes: typeof this.defaultAttributeValues,
    initCapacity?: number,
    excludeAttributes?: (keyof Attributes)[],
  ) {
    this.createInstanceCall = entityType;

    this.defaultAttributeValues = defaultAttributes;
    this.notSerializedAttributes = new Set(excludeAttributes);

    this.eventManager = new EventManager();

    this.entities = [];
    this.dataStore = {} as typeof this.dataStore;
    this.currentCapacity = initCapacity ? initCapacity : this.currentCapacity;
    this.idToIndex = {};

    this.resetAllEntities();
  }

  private generateUUID() {
    let tempId = crypto.randomUUID();
    while (this.idToIndex[tempId]) tempId = crypto.randomUUID();
    return tempId;
  }

  // HELPERS
  private getActualIndex(index: string | number): number {
    if (typeof index === "number") {
      if (index >= this.entities.length) {
        throw new Error(`Entity at index ${index} does not exist`);
      }

      return index;
    }

    if (!(index in this.idToIndex)) throw new Error(`Entity for Id ${index} does not exist`);

    return this.idToIndex[index];
  }

  private getId(index: string | number): string {
    if (typeof index === "string") {
      if (!(index in this.idToIndex)) {
        throw new Error(`Entity with id ${index} does not exist`);
      }

      return index;
    }

    if (!(index >= this.entities.length)) throw new Error(`Entity for Id ${index} does not exist`);

    return this.entities[index].id;
  }

  // SERIALIZE

  public dump(): string {
    return JSON.stringify(
      Object.fromEntries(
        Object.entries(this.dataStore).filter(
          ([k, _]) => !this.notSerializedAttributes.has(k as keyof Attributes),
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

    this.emit("load", true);
  }

  // EVENTS

  public addEventListener<Key extends keyof Events>(eventName: Key, callback: Events[Key]): void {
    this.eventManager.addEventListener(eventName, callback);
  }

  public removeEventListener<Key extends keyof Events>(
    eventName: Key,
    callback: Events[Key],
  ): void {
    this.eventManager.removeEventListener(eventName, callback);
  }

  protected emit<Key extends keyof Events>(eventName: Key, ...args: unknown[]): void {
    console.log(eventName);
    this.eventManager.emit(eventName, ...args);
  }

  // GET

  public get(index: string | number): Inst {
    return this.entities[this.getActualIndex(index)];
  }

  public getSafe(index: string | number): Inst | null {
    if (typeof index === "number") {
      if (index >= this.entities.length) {
        return null;
      }

      return this.entities[index];
    }

    if (!(index in this.idToIndex)) return null;

    return this.entities[this.idToIndex[index]];
  }

  public getAll(): Inst[] {
    return [...this.entities];
  }

  public getAttribute<K extends keyof typeof this.dataStore>(
    key: K,
    index: string | number,
  ): (typeof this.dataStore)[K][number] {
    return this.dataStore[key][this.getActualIndex(index)];
  }

  public getAttributeForAll<K extends keyof typeof this.dataStore>(
    key: K,
  ): (typeof this.dataStore)[K][number][] {
    const array = this.dataStore[key];
    return [...array];
  }

  public __verifyEntity(index: number, entity: Inst): boolean {
    return this.entities[index] === entity;
  }

  // SET

  public setAttribute<K extends keyof typeof this.dataStore>(
    key: K,
    index: string | number,
    value: (typeof this.dataStore)[K][number],
  ): boolean {
    // TODO: do some checks to allow assignment
    // TODO: throw some exceptions?

    const finalIndex = this.getActualIndex(index);
    this.dataStore[key][finalIndex] = value;

    this.emit("set_entity", {
      who: this.dataStore["publicId"][finalIndex],
      what: key,
    });

    return true;
  }

  public setAttributeForAll<K extends keyof Attributes>(
    key: K,
    value?: (typeof this.dataStore)[K][number],
    generator?: () => (typeof this.dataStore)[K][number],
  ) {
    const newAttributeArray = new Array(this.currentCapacity).fill(undefined);

    this.dataStore = {
      ...this.dataStore,
      [key]: newAttributeArray.map((x) => (generator ? generator() : value || x)),
    };
    this.emit("set_all_attr", { what: key });
  }

  public setAttributePer<K extends keyof Attributes>(
    key: K,
    array: (typeof this.dataStore)[K][number][],
  ) {
    if (this.currentCapacity < array.length) {
      this.resizeStore();
    }

    this.resetAttributeForAll(key);
    const newArray = [...array, ...this.dataStore[key].splice(array.length)];
    this.dataStore = { ...this.dataStore, [key]: newArray };
    this.emit("set_per_attr", { what: key });
  }

  public resetAttribute<K extends keyof Attributes>(key: K, index: string | number) {
    const defaults = this.defaultAttributeValues[key as keyof Attributes];
    this.setAttribute(key, index, defaults?.generator ? defaults.generator() : defaults?.value);
    this.emit("reset_entity_attr", { who: this.getId(index), what: key });
  }

  public resetEntity(index: string | number) {
    Object.keys(this.defaultAttributeValues).forEach((key) =>
      this.resetAttribute(key as keyof Attributes, index),
    );
    this.emit("reset_entity", { who: this.getId(index) });
  }

  public resetAttributeForAll<K extends keyof Attributes>(key: K) {
    const defaults = this.defaultAttributeValues[key as keyof Attributes];
    this.setAttributeForAll(key, defaults?.value, defaults?.generator);
    this.emit("reset_all_attr", { what: "all" });
  }

  public resetAllEntities() {
    this.resetIds();
    Object.keys(this.defaultAttributeValues).forEach((key) =>
      this.resetAttributeForAll(key as keyof Attributes),
    );
    this.emit("reset_all");
  }

  private resetIds() {
    const newAttributeArray = new Array<string>(this.currentCapacity).fill("");

    this.idToIndex = {};
    this.dataStore.publicId = newAttributeArray.map((_, i) => {
      const id = this.generateUUID();

      this.idToIndex[id] = i;
      return id;
    });
  }

  // ITERATE

  public forEachEntity<R>(pred: (x: Inst) => R) {
    this.entities.forEach(pred);
  }

  public mapEntities<R>(pred: (x: Inst) => R): R[] {
    return this.entities.map(pred);
  }

  // MANAGE

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

    const newInstIndex = this.entities.length;
    const newInstId = this.generateUUID();

    const newInstance = new this.createInstanceCall(this, newInstIndex);
    this.entities.push(newInstance);
    this.dataStore.publicId[newInstIndex] = newInstId;
    this.idToIndex[newInstId] = newInstIndex;

    this.emit("create_entity", { who: newInstId });

    return newInstance;
  }

  public initializeEntities(): void {
    if (this.isInit) {
      throw new Error("Entities already exist!");
    }

    for (let index = this.count; index < this.currentCapacity; index++) {
      this.create();
    }

    this.isInit = true;
    this.emit("create_all");
  }

  private resizeStore(_number?: number): void {
    throw new Error("Method not implemented yet. Need to allocate more space to create entities.");
  }

  public fullReset(capacity?: number) {
    this.isInit = false;

    this.entities = [];
    this.dataStore = {} as typeof this.dataStore;
    this.currentCapacity = capacity ? capacity : this.currentCapacity;
    this.idToIndex = {};

    this.resetAllEntities();
    this.emit("create_reset");
  }
}
