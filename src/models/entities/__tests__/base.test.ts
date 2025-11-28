import { beforeAll, describe, expect, it } from "vitest";
import { Entity, EntityEventsToCallback, EntityManager } from "../base";

interface TestAttributes {
  name: string;
  count: number;
}

describe("EntityManager", () => {
  let entityManager: EntityManager<TestAttributes, Entity, EntityEventsToCallback>;

  beforeAll(() => {
    entityManager = new EntityManager<TestAttributes, Entity, EntityEventsToCallback>(
      Entity,
      {
        name: { value: "Test" },
        count: { generator: () => Math.random() },
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

    const id = entityManager.__getPublicId(0);
    expect(id).not.toBeNull();
    expect(entityManager.get(id)).not.toBeNull();
  });

  it("");
});
