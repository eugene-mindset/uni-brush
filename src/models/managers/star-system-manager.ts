/**
 * General idea is that certain data related to star systems has a couple of constraints
 * - Needs to vectorized for efficient rendering purposes
 * - Easily load from and dump data into serializable data formats
 * - Not easily modifiable to where the logic no longer works
 *
 * We have a StarSystemManager singleton that is allows for this enforcement in design. Access to
 * creating systems and editing their properties is guarded here. The exposed Manager and StarSystem
 * classes hide the underlying detail to what is just necessary.
 */
import * as THREE from "three";
import { StarSystemVisual } from "@/renderer";

import { DataInstance, DataInstanceInternal, DataManager, DataManagerClass } from "./data-manager";
import { EntityTypes } from "./types";

interface StarSystemClass extends DataInstance {
  visual: StarSystemVisual;
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

interface StarSystemStoreModel extends DataInstance {
  obj3D: StarSystemVisual;
  name: string;
  desc: string;
  initPos: THREE.Vector3;
}

class StarSystemInternal extends DataInstanceInternal {
  public readonly type: EntityTypes = EntityTypes.STAR_SYSTEM;
  public static manager: StarSystemManagerInternalClass;

  get publicId(): string {
    return StarSystemInternal.manager.getPublicId(this.internalId);
  }

  get visual(): StarSystemVisual {
    return StarSystemInternal.manager.getObject3D(this.internalId);
  }

  set visual(objRef: StarSystemVisual) {
    StarSystemInternal.manager.setObject3D(this.internalId, objRef);
  }

  get name(): string {
    return StarSystemInternal.manager.getName(this.internalId);
  }

  set name(newName: string) {
    StarSystemInternal.manager.setName(this.internalId, newName);
  }

  get desc(): string {
    return StarSystemInternal.manager.getDesc(this.internalId);
  }

  get initialPosition(): THREE.Vector3 {
    return StarSystemInternal.manager.getInitialPosition(this.internalId);
  }
}

interface StarSystemManagerClass extends DataManager<StarSystemClass, StarSystemStoreModel> {
  updateVisualScale: (framePos: THREE.Vector3) => void;
  disposeVisuals: () => void;
}

class StarSystemManagerInternalClass extends DataManagerClass<
  StarSystemClass,
  StarSystemInternal,
  StarSystemStoreModel
> {
  public readonly type: EntityTypes = EntityTypes.STAR_SYSTEM;

  constructor() {
    super(StarSystemInternal, 2500, ["obj3D"]);
    this.initProperties();
  }

  private initProperties() {
    this.batchInitializePropertyArray("obj3D");
    this.batchInitializePropertyArray("name");
    this.batchInitializePropertyArray("desc");
    this.batchInitializePropertyArray("initPos");
  }

  public getObject3D(id: number): StarSystemVisual {
    return this.getPropertyForInstance(id, "obj3D");
  }

  public setObject3D(id: number, ref: StarSystemVisual) {
    // TODO: do some checks
    this.setPropertyForInstance(id, "obj3D", ref);
  }

  public getName(id: number): string {
    return this.getPropertyForInstance(id, "name");
  }

  public setName(id: number, name: string) {
    // TODO: do some checks
    this.setPropertyForInstance(id, "name", name);
  }

  public getDesc(id: number): string {
    return this.getPropertyForInstance(id, "desc");
  }

  public getInitialPosition(id: number): THREE.Vector3 {
    return this.getPropertyForInstance(id, "initPos");
  }

  public fullReset(capacity?: number): void {
    // cleanup before dereferencing some three.js stuff
    this.disposeVisuals();

    super.fullReset(capacity);
    this.initProperties();
  }

  public updateVisualScale(framePos: THREE.Vector3): void {
    this.forEachEntity((x) => x.visual?.updateScale(framePos));
  }

  public disposeVisuals() {
    this.forEachEntity((x) => x.visual?.dispose());
  }
}

StarSystemInternal.manager = new StarSystemManagerInternalClass();

export namespace StarSystem {
  export type EntityType = StarSystemClass;
  export type ManagerType = StarSystemManagerClass;
  export const Manager: StarSystemManagerClass = StarSystemInternal.manager;
}
