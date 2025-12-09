import * as THREE from "three";

import { Entity, EntityTypes } from "@/models";

export class BaseVisual {
  private _dataId: string;
  private _entityType: EntityTypes;
  protected _obj3D?: THREE.Object3D;

  protected constructor(newId: string, entityType: EntityTypes) {
    this._dataId = newId;
    this._entityType = entityType;
  }

  protected setUserData(data?: object) {
    if (!this._obj3D) return;
    this._obj3D.userData = {
      ...data,
      visualRef: this,
      entityId: this._dataId,
      entityType: this._entityType,
    };
  }

  public get object3D(): THREE.Object3D {
    if (this._obj3D) return this._obj3D;
    throw new Error("Object3D of instance either not created successfully was deleted.");
  }

  public get id(): string {
    return this._dataId;
  }

  public get entity(): Entity.EntityBase {
    throw new Error("Visual has no abstract entity type.");
  }

  public get threeId(): string {
    if (this._obj3D) return this._obj3D.uuid;
    throw new Error("Object3D of instance either not created successfully was deleted.");
  }

  public dispose(): void {
    /* empty */
  }
}
