import * as THREE from "three";

import { StarSystemVisual } from "@/renderer";

import { Entity, EntityManager } from "./base";
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

export class StarSystemEntity extends Entity {
  public static readonly type = EntityTypes.STAR_SYSTEM;
  protected manager: StarSystemManager;

  constructor(manager: unknown, newId: number, ..._: never[]) {
    assert(manager instanceof StarSystemManager, new Error("Cannot create"));
    super(manager, newId);
    this.manager = manager;
  }

  get visual(): StarSystemVisual | undefined {
    return this.manager.getAttributeFor(this.internalId, "obj3D");
  }

  set visual(objRef: StarSystemVisual) {
    this.manager.setAttributeFor(this.internalId, "obj3D", objRef);
  }

  get name(): string | undefined {
    return this.manager.getAttributeFor(this.internalId, "name");
  }

  set name(newName: string) {
    this.manager.setAttributeFor(this.internalId, "name", newName);
  }

  get desc(): string | undefined {
    return this.manager.getAttributeFor(this.internalId, "desc");
  }

  get initialPosition(): THREE.Vector3 | undefined {
    return this.manager.getAttributeFor(this.internalId, "initialPosition");
  }
}

export class StarSystemManager extends EntityManager<StarSystemAttributes, StarSystemEntity> {
  constructor() {
    super(
      StarSystemEntity,
      {
        obj3D: {},
        name: {
          value: "Unnamed",
        },
        desc: {
          value: "N/A",
        },
        initialPosition: {},
      },
      2500,
      ["obj3D"],
    );
  }

  public disposeVisuals() {
    this.dataStore.obj3D.forEach((x) => x?.dispose());
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
