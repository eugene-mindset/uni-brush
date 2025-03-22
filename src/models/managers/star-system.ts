/**
 * General idea is that certain data related to star systems has a couple of constraints
 * - Needs to vectorized for efficient rendering purposes
 * - Easily load from and dump data into serializable data formats
 * - Not easily modifiable to where the logic no longer works
 *
 * We have a StarSystemManager singleton that is allows for this enforcement in design. Access to
 * creating systems and editing their properties is guarded here. The exposed Manager and StarSystem
 * classes hide the underlying detail to what is just necesscary.
 */
import { BaseVisual } from "@/renderer/threejs";
import { Position } from "@/types";

import { DataInstance, DataInstanceInternal, DataManager, DataManagerClass } from "./data-manager";

interface StarSystemClass {
  publicId: string;
  visual: BaseVisual;
  name: string;
  desc: string;
  initialPosition: Position;
  // owner: Civilization;
  // stars: Stars[];
  // sector: string;
  // coordinates: SystemCoordinate;
  // lanes: Lane[];
  // geography: GeoFeatures[];
}

interface StarSystemStoreModel extends DataInstance {
  obj3D: BaseVisual;
  name: string;
  desc: string;
  initPos: Position;
}

class StarSystemInternal extends DataInstanceInternal implements StarSystemClass {
  public static manager: StarSystemManagerInternalClass;

  get publicId(): string {
    return StarSystemInternal.manager.getPublicId(this.internalId);
  }

  get visual(): BaseVisual {
    return StarSystemInternal.manager.getObject3D(this.internalId);
  }

  set visual(objRef: BaseVisual) {
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

  get initialPosition(): Position {
    return StarSystemInternal.manager.getInitialPosition(this.internalId);
  }
}

interface StarSystemManagerClass extends DataManager<StarSystemClass, StarSystemStoreModel> {}

class StarSystemManagerInternalClass extends DataManagerClass<
  StarSystemClass,
  StarSystemInternal,
  StarSystemStoreModel
> {
  constructor() {
    super(StarSystemInternal);
    this.batchInitializePropertyArray("obj3D");
    this.batchInitializePropertyArray("initPos");
  }

  public getObject3D(id: number): BaseVisual {
    return this.getPropertyForInstance(id, "obj3D");
  }

  public setObject3D(id: number, ref: BaseVisual) {
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

  public getInitialPosition(id: number): Position {
    return this.getPropertyForInstance(id, "initPos");
  }

  public fullReset(capacity?: number): void {
    // cleanup before dereferencing some threejs stuff
    this.forEachEntity((x) => x.visual?.dispose());

    super.fullReset(capacity);
    this.batchInitializePropertyArray("obj3D");
    this.batchInitializePropertyArray("initPos");
  }
}

StarSystemInternal.manager = new StarSystemManagerInternalClass();

export namespace StarSystem {
  export type InstanceType = StarSystemClass;
  export type ManagerType = StarSystemManagerClass;
  export const Manager: StarSystemManagerClass = StarSystemInternal.manager;
}
