import * as THREE from "three";

export class BaseVisual {
  private dataId: string;
  protected obj3D?: THREE.Object3D;

  constructor(newId: string) {
    this.dataId = newId;
  }

  public get object3D(): THREE.Object3D {
    if (this.obj3D) return this.obj3D;
    throw new Error("Object3D of instance either not created successfully was deleted.");
  }

  public get id(): string {
    return this.dataId;
  }

  public get threeId(): string {
    if (this.obj3D) return this.obj3D.uuid;
    throw new Error("Object3D of instance either not created successfully was deleted.");
  }

  public dispose() {}
}
