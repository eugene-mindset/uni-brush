/* v8 ignore file -- @preserve */

import * as THREE from "three";

import { StarSystemVisual } from "@/renderer";

import { EntityBase, EventsToCallbackBase, ManagerBase } from "./base";
import { EntityTypes } from "./types";
import assert from "assert";

export interface Attributes {
  obj3D: StarSystemVisual;
  name: string;
  desc: string;
  initPos: THREE.Vector3;
  // owner: Civilization;
  // stars: Stars[];
  // sector: string;
  // coordinates: SystemCoordinate;
  // lanes: Lane[];
  // geography: GeoFeatures[];
}

export interface EventsToCallback extends EventsToCallbackBase {
  dispose: () => void;
}

export class Entity extends EntityBase {
  public static readonly type = EntityTypes.STAR_SYSTEM;
  public readonly type = Entity.type;
  protected manager: Manager;

  constructor(manager: unknown, newId: number) {
    assert(
      manager instanceof Manager,
      new Error("Cannot create instance without manager being StarSystemManager"),
    );
    super(manager, newId);
    this.manager = manager;
  }

  get obj3D(): StarSystemVisual | undefined {
    return this.manager.getAttribute("obj3D", this._index);
  }

  set obj3D(objRef: StarSystemVisual) {
    this.manager.setAttribute("obj3D", this._index, objRef);
  }

  get name(): string | undefined {
    return this.manager.getAttribute("name", this._index);
  }

  set name(newName: string) {
    this.manager.setAttribute("name", this._index, newName);
  }

  get desc(): string | undefined {
    return this.manager.getAttribute("desc", this._index);
  }

  get initPos(): THREE.Vector3 | undefined {
    return this.manager.getAttribute("initPos", this._index);
  }
}

export class Manager extends ManagerBase<Attributes, Entity, EventsToCallback> {
  public static initialCapacity = 2500;

  constructor() {
    super(
      Entity,
      {
        name: {
          value: "Unnamed",
        },
        desc: {
          value: "N/A",
        },
        obj3D: {},
        initPos: {},
      },
      Manager.initialCapacity,
      ["obj3D"],
    );

    this.resetAllEntities();
  }

  public disposeVisuals() {
    this.dataStore.obj3D.forEach((x) => x?.dispose());
    this.emit("dispose");
  }

  public override fullReset(capacity?: number): void {
    // cleanup before dereferencing some three.js stuff
    this.disposeVisuals();
    super.fullReset(capacity);
  }

  public updateVisualScale(framePos: THREE.Vector3): void {
    this.dataStore.obj3D.forEach((x) => x?.updateScale(framePos));
  }
}
