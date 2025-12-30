/* v8 ignore file -- @preserve */

import * as THREE from "three";

import { StarSystemVisual } from "@/renderer";
import { MathHelpers } from "@/util";

import { EntityBase, EventsToCallbackBase, ManagerBase } from "./base";
import { EntityTypes } from "./types";

export interface StarSystemAttributes {
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

export interface StarSystemEvents extends EventsToCallbackBase {
  dispose: () => void;
}

export class StarSystemEntity extends EntityBase<StarSystemAttributes> {
  public static readonly type = EntityTypes.STAR_SYSTEM;
  public readonly type = StarSystemEntity.type;
  protected manager: StarSystemManager;

  constructor(manager: unknown, newId: number) {
    if (!(manager instanceof StarSystemManager)) {
      throw new Error("Cannot create instance without manager being StarSystemManager");
    }

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

export class StarSystemManager extends ManagerBase<
  StarSystemAttributes,
  StarSystemEntity,
  StarSystemEvents
> {
  public static readonly type: EntityTypes = EntityTypes.STAR_SYSTEM;
  public readonly type: EntityTypes = EntityTypes.STAR_SYSTEM;

  public static initialCapacity = 2500;

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
        obj3D: {},
        initPos: {
          generator: () => MathHelpers.randomVectorFromNormal().multiplyScalar(1000),
        },
      },
      StarSystemManager.initialCapacity,
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
