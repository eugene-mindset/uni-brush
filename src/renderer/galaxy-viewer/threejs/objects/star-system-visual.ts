import * as THREE from "three";

export class StarSystemVisual {
  private _dataId: string;
  private _geometry?: THREE.BufferGeometry;
  private _material?: THREE.Material;
  private _mesh?: THREE.Mesh;

  constructor(dataId: string, pos?: THREE.Vector3) {
    this._dataId = dataId;

    this._geometry = new THREE.SphereGeometry(0.5);
    this._material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this._mesh = new THREE.Mesh(this._geometry, this._material);

    if (pos) this._mesh.position.copy(pos);
  }

  public get object3D(): THREE.Object3D {
    if (this._mesh) return this._mesh;
    throw new Error("Object3D of instance either not created successfully was deleted.");
  }

  public get dataId(): string {
    return this._dataId;
  }

  public get threeId(): string {
    if (this._mesh) return this._mesh.uuid;
    throw new Error("Object3D of instance either not created successfully was deleted.");
  }

  public dispose() {
    this._geometry?.dispose();
    this._material?.dispose();
  }
}
