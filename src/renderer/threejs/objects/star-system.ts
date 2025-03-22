import * as THREE from "three";
import { BaseVisual } from "./base";

export class StarSystemVisual extends BaseVisual {
  private geometry?: THREE.BufferGeometry;
  private material?: THREE.Material;

  constructor(newId: string, pos?: THREE.Vector3) {
    super(newId);
    this.geometry = new THREE.SphereGeometry(0.5);
    this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.obj3D = new THREE.Mesh(this.geometry, this.material);

    if (pos) this.obj3D.position.copy(pos);
  }

  public dispose() {
    this.geometry?.dispose();
    this.material?.dispose();
  }
}
