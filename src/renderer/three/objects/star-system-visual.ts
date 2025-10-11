import * as THREE from "three";
import { BaseVisual } from "./base-visual";
import { Entity, EntityTypes } from "@/models";
import { BLOOM_LAYER } from "@/config";
import { MathHelpers } from "@/util";

export class StarSystemVisual extends BaseVisual {
  private geometry?: THREE.BufferGeometry;
  private material?: THREE.Material;
  private position: THREE.Vector3 = new THREE.Vector3();

  private renderScale: number = 1;

  public readonly MIN_SCALE = 0.25;
  public readonly MAX_SCALE = 5;

  constructor(newId: string, pos?: THREE.Vector3) {
    super(newId, EntityTypes.STAR_SYSTEM);
    this.geometry = new THREE.SphereGeometry(MathHelpers.clamp(Math.random(), 0.45, 0.95));
    this.material = new THREE.MeshStandardMaterial({
      color: 0xcccbef,
      emissive: 0xcccbef,
      emissiveIntensity: 1.1,
    });
    this.obj3D = new THREE.Mesh(this.geometry, this.material);
    this.obj3D.layers.enable(BLOOM_LAYER);
    if (pos) {
      this.obj3D.position.copy(pos);
      this.position = new THREE.Vector3().copy(pos);
    }

    this.setUserData();
  }

  public get entity(): Entity.StarSystem.EntityType {
    return Entity.StarSystem.Manager.get(this.id);
  }

  public updateScale(position: THREE.Vector3) {
    let dist = this.position.distanceTo(position) / 250;

    // update star size
    this.renderScale = MathHelpers.clamp(dist, this.MIN_SCALE, this.MAX_SCALE);
    this.obj3D?.scale.copy(new THREE.Vector3(this.renderScale, this.renderScale, this.renderScale));
  }

  public dispose() {
    this.geometry?.dispose();
    this.material?.dispose();
  }
}
