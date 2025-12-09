import { getDefaultStore } from "jotai";
import * as THREE from "three";

import starSpriteImage from "@/assets/sprite120.png";
import { Entity, EntityTypes } from "@/models";
import { Global } from "@/renderer";
import { starSystemManagerAtom } from "@/store";
import { MathHelpers } from "@/util";

import { BaseVisual } from "./base-visual";

const starSpriteTexture = new THREE.TextureLoader().load(starSpriteImage);
const starSpriteMaterial = new THREE.SpriteMaterial({
  map: starSpriteTexture,
  color: "#cccbef",
});

// const starLowSpriteTexture = new THREE.TextureLoader().load("src/assets//sprite1.png");
// const starLowSpriteMaterial = new THREE.SpriteMaterial({
//   map: starLowSpriteTexture,
//   color: "#cccbef",
// });

export class StarSystemVisual extends BaseVisual {
  private geometry?: THREE.BufferGeometry;
  private material?: THREE.Material;
  private position: THREE.Vector3 = new THREE.Vector3();

  private renderScale: number = 1;
  private radius: number;

  public readonly MIN_SCALE = 0.5;
  public readonly MAX_SCALE = 5;

  private readonly MIN_RADIUS = 0.45;
  private readonly MAX_RADIUS = 0.95;

  private readonly RENDER_THRESHOLD = 30;
  private readonly RENDER_RADIUS_THRESHOLD = 0.6;

  constructor(newId: string, pos?: THREE.Vector3) {
    super(newId, EntityTypes.STAR_SYSTEM);

    this.radius = MathHelpers.clamp(Math.random(), this.MIN_RADIUS, this.MAX_RADIUS);
    this.createObject3D(pos);
    this.setUserData();
  }

  private createObject3D(pos: THREE.Vector3 | undefined): void {
    const lod = new THREE.LOD();

    this.material = new THREE.MeshStandardMaterial({
      color: "#cccbef",
      emissive: "#cccbef",
    });

    const highDetailGeo = new THREE.SphereGeometry(this.radius, 32, 16);
    const highMesh = new THREE.Mesh(highDetailGeo, this.material);
    lod.addLevel(highMesh, 2);

    const lowDetailGeo = new THREE.SphereGeometry(this.radius, 16, 8);
    const lowMesh = new THREE.Mesh(lowDetailGeo, this.material);
    lod.addLevel(lowMesh, 5);

    const spriteMesh = new THREE.Sprite(starSpriteMaterial);
    spriteMesh.scale.multiplyScalar(this.radius * 2);
    lod.addLevel(spriteMesh, 10);

    this._obj3D = lod;
    this._obj3D.layers.enable(Global.Layers.BLOOM_LAYER);

    if (pos) {
      this._obj3D.position.copy(pos);
      this.position.copy(pos);
    }
  }

  public get entity(): Entity.StarSystemEntity {
    return getDefaultStore().get(starSystemManagerAtom).get(this.id);
  }

  public updateScale(position: THREE.Vector3): void {
    if (!this._obj3D) return;

    const dist = this.position.distanceTo(position) / 250;

    // update star size
    this.renderScale = MathHelpers.clamp(dist, this.MIN_SCALE, this.MAX_SCALE);

    if (this.renderScale > this.RENDER_THRESHOLD && this.radius < this.RENDER_RADIUS_THRESHOLD) {
      this._obj3D.visible = false;
    } else {
      this._obj3D.visible = true;
    }

    this._obj3D.scale.copy(new THREE.Vector3(this.renderScale, this.renderScale, this.renderScale));
  }

  public dispose(): void {
    this.geometry?.dispose();
    this.material?.dispose();
  }
}
