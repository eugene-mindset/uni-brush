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

import { Position } from "@/types";

import {
  DataInstanceInternal,
  DataManager,
  DataManagerClass,
  DataStoreModel,
} from "./data-manager";

export interface StarSystem {
  publicId: string;
  name: string;

  initialPosition: Position;

  // owner: Civilization;
  // stars: Stars[];
  // sector: string;
  // coordinates: SystemCoordinate;
  // lanes: Lane[];
  // geography: GeoFeatures[];
}

interface StarSystemStoreModel extends DataStoreModel {
  name: string;
  initPos: Position;
}

class StarSystemInternal extends DataInstanceInternal implements StarSystem {
  get name(): string {
    return StarSystemInternal.Manager.getName(this.internalId);
  }

  set name(newName: string) {
    StarSystemInternal.Manager.setName(this.internalId, newName);
  }

  get initialPosition(): Position {
    return StarSystemInternal.Manager.getInitialPosition(this.internalId);
  }
}

class StarSystemManagerClass extends DataManagerClass<
  StarSystem,
  StarSystemInternal,
  StarSystemStoreModel
> {
  constructor() {
    super(StarSystemInternal);
  }

  public getName(id: number): string {
    return this.getDataValueForInstance(id, "name");
  }

  public setName(id: number, name: string) {
    // TODO: do some checks
    this.setDataValueForInstance(id, "name", name);
  }

  public getInitialPosition(id: number): Position {
    return this.getDataValueForInstance(id, "initPos");
  }
}

export type StarSystemManager = DataManager<StarSystem, StarSystemStoreModel>;

const StarSystemManagerInternal = new StarSystemManagerClass();

namespace StarSystemInternal {
  export const Manager: StarSystemManagerClass = StarSystemManagerInternal;
}

export const StarSystemManager = StarSystemManagerInternal as StarSystemManager;
