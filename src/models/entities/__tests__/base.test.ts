import { beforeEach, describe, expect, it } from "vitest";
import { EntityBase, EventsToCallbackBase, ManagerBase } from "../base";

interface TestAttributes {
  name: string;
  count: number;
}

describe("EntityManager", () => {
  let entityManager: ManagerBase<TestAttributes, EntityBase, EventsToCallbackBase>;

  beforeEach(() => {
    entityManager = new ManagerBase<TestAttributes, EntityBase, EventsToCallbackBase>(
      EntityBase,
      {
        name: { value: "Test" },
        count: { generator: () => Math.round(Math.random() * 100) },
      },
      100,
      ["count"],
    );
  });

  it("creates correct initial state", () => {
    expect(entityManager.capacity).toEqual(100);
    expect(entityManager.count).toEqual(0);
    expect(entityManager.isInitialized).toBeFalsy();
  });

  it("initializes correctly", () => {
    entityManager.initializeEntities();
    expect(entityManager.count).toEqual(100);
    expect(entityManager.isInitialized).toBeTruthy();

    const id = entityManager.get(0).id;
    expect(id).not.toBeNull();
    expect(entityManager.get(id)).not.toBeNull();
  });

  it("resets correctly", () => {
    entityManager.initializeEntities();
    expect(entityManager.isInitialized).toBeTruthy();

    entityManager.fullReset();
    expect(entityManager.isInitialized).toBeFalsy();
    expect(entityManager.count).toEqual(0);

    entityManager.fullReset(200);
    expect(entityManager.capacity).toEqual(200);
    expect(entityManager.count).toEqual(0);

    entityManager.initializeEntities();
    expect(entityManager.capacity).toEqual(200);
    expect(entityManager.count).toEqual(200);

    entityManager.fullReset(0);
    entityManager.initializeEntities();
    expect(() => entityManager.create()).toThrowError();

    entityManager.fullReset(1);
    expect(entityManager.create()).not.toBeNull();
    expect(() => entityManager.create()).toThrowError();

    entityManager.fullReset(100);
    entityManager.initializeEntities();
    expect(() => entityManager.initializeEntities()).toThrow();
  });

  it("get entities", () => {
    entityManager.initializeEntities();
    const entity = entityManager.get(0);
    const id = entity.id;

    expect(() => entityManager.get("")).toThrowError();
    expect(entityManager.getSafe("")).toBeNull();
    expect(() => entityManager.get(1001)).toThrowError();
    expect(entityManager.getSafe(1010)).toBeNull();

    expect(entityManager.get(id)).toEqual(entity);
    expect(entityManager.get(id).id).toEqual(id);
    expect(entityManager.getSafe(id)).not.toBeNull();

    expect(entityManager.getAll().length).toEqual(100);
    expect(entityManager.getAll()[0]).toEqual(entity);

    expect(entityManager.getAttributeForAll("name").length).toEqual(100);
    expect(entityManager.getAttributeForAll("name")[0]).toEqual("Test");
  });

  it("set entities", () => {});

  it("iterate over entities", () => {});

  it("listening to manager changes", () => {});
});

describe("Entity", () => {
  let entityManager: ManagerBase<TestAttributes, EntityBase, EventsToCallbackBase>;

  beforeEach(() => {
    entityManager = new ManagerBase<TestAttributes, EntityBase, EventsToCallbackBase>(
      EntityBase,
      {
        name: { value: "Test" },
        count: { generator: () => Math.random() },
      },
      100,
      ["count"],
    );
  });

  it("created entity properly created", () => {
    entityManager.initializeEntities();
    const entity = entityManager.get(0);
    const id = entity.id;

    expect(id).not.toBeNull();

    expect(entity).not.toBeNull();
    expect(entity.id).toEqual(id);
    expect(entity.isWeakReference).toBeFalsy();
  });
});
