import * as THREE from "three";
import { BaseVisual } from "./base-visual";
import { EntityTypes } from "@/models";
import { BLOOM_LAYER } from "@/config";
import { MathHelpers } from "@/util";

export class StarSystemVisual extends BaseVisual {
  private geometry?: THREE.BufferGeometry;
  private material?: THREE.Material;
  private position: THREE.Vector3 = new THREE.Vector3();

  private renderScale: number = 1;

  constructor(newId: string, pos?: THREE.Vector3) {
    super(newId);
    this.geometry = new THREE.SphereGeometry(0.5);
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.8,
    });
    this.obj3D = new THREE.Mesh(this.geometry, this.material);
    this.obj3D.layers.enable(BLOOM_LAYER);
    if (pos) {
      this.obj3D.position.copy(pos);
      this.position = new THREE.Vector3().copy(pos);
    }

    this.setUserData({ ref: this, id: newId, type: EntityTypes.STAR_SYSTEM });
  }

  public updateScale(position: THREE.Vector3) {
    let dist = this.position.distanceTo(position) / 250;

    // update star size
    this.renderScale = MathHelpers.clamp(dist, 0.1, 3);
    this.obj3D?.scale.copy(new THREE.Vector3(this.renderScale, this.renderScale, this.renderScale));
  }

  public dispose() {
    this.geometry?.dispose();
    this.material?.dispose();
  }
}
