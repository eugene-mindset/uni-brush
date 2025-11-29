/* v8 ignore file -- @preserve */

import * as THREE from "three";

import { StarSystemVisual } from "@/renderer";

import { Entity, EntityEventsToCallback, EntityManager } from "./base";
import { EntityTypes } from "./types";
import assert from "assert";

export interface StarSystemAttributes {
  obj3D: StarSystemVisual;
  name: string;
  desc: string;
  initialPosition: THREE.Vector3;
  // owner: Civilization;
  // stars: Stars[];
  // sector: string;
  // coordinates: SystemCoordinate;
  // lanes: Lane[];
  // geography: GeoFeatures[];
}

interface StarSystemEntityEventsToCallback extends EntityEventsToCallback {
  dispose: () => void;
}

export class StarSystemEntity extends Entity {
  public static readonly type = EntityTypes.STAR_SYSTEM;
  protected manager: StarSystemManager;

  constructor(manager: unknown, newId: number) {
    assert(
      manager instanceof StarSystemManager,
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

  get initialPosition(): THREE.Vector3 | undefined {
    return this.manager.getAttribute("initialPosition", this._index);
  }
}

export class StarSystemManager extends EntityManager<
  StarSystemAttributes,
  StarSystemEntity,
  StarSystemEntityEventsToCallback
> {
  constructor() {
    super(
      StarSystemEntity,
      {
        name: {
          value: "Unnamed",
        },
        desc: {
          value: "N/A",
        },
      },
      2500,
      ["obj3D"],
    );
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
