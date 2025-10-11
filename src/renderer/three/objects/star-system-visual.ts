import * as THREE from "three";
import { BaseVisual } from "./base-visual";
import { Entity, EntityTypes } from "@/models";
import { BASE_LAYER, BLOOM_LAYER } from "@/config";
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
    this.createObj3D(pos);
    this.setUserData();
  }

  private createObj3D(pos?: THREE.Vector3) {
    const lod = new THREE.LOD();
    this.material = new THREE.MeshStandardMaterial({
      color: 0xcccbef,
      emissive: 0xcccbef,
      emissiveIntensity: 1.1,
    });

    const radius = MathHelpers.clamp(Math.random(), 0.45, 0.95);
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.IcosahedronGeometry(radius, 3 - i);
      const mesh = new THREE.Mesh(geometry, this.material);
      lod.addLevel(mesh, i * 75);
    }

    this.obj3D = lod;
    this.obj3D.layers.enable(BLOOM_LAYER);

    if (pos) {
      this.obj3D.position.copy(pos);
      this.position.copy(pos);
    }
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
