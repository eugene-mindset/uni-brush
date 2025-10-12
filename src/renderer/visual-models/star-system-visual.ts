import * as THREE from "three";
import { BaseVisual } from "./base-visual";
import { Entity, EntityTypes } from "@/models";
import { BLOOM_LAYER } from "@/config";
import { MathHelpers } from "@/util";

const starSpriteTexture = new THREE.TextureLoader().load("src/assets//sprite120.png");
const starSpriteMaterial = new THREE.SpriteMaterial({
  map: starSpriteTexture,
  color: "#cccbef",
});

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

  private createObject3D(pos: THREE.Vector3 | undefined) {
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
    lod.addLevel(lowMesh, 3);

    const pointMesh = new THREE.Sprite(starSpriteMaterial);
    pointMesh.scale.multiplyScalar(this.radius * 2);
    lod.addLevel(pointMesh, 5);

    this._obj3D = lod;
    this._obj3D.layers.enable(BLOOM_LAYER);

    if (pos) {
      this._obj3D.position.copy(pos);
      this.position.copy(pos);
    }
  }

  public get entity(): Entity.StarSystem.EntityType {
    return Entity.StarSystem.Manager.get(this.id);
  }

  public updateScale(position: THREE.Vector3) {
    if (!this._obj3D) return;

    let dist = this.position.distanceTo(position) / 250;

    // update star size
    this.renderScale = MathHelpers.clamp(dist, this.MIN_SCALE, this.MAX_SCALE);

    if (this.renderScale > this.RENDER_THRESHOLD && this.radius < this.RENDER_RADIUS_THRESHOLD) {
      this._obj3D.visible = false;
    } else {
      this._obj3D.visible = true;
    }

    this._obj3D.scale.copy(new THREE.Vector3(this.renderScale, this.renderScale, this.renderScale));
  }

  public dispose() {
    this.geometry?.dispose();
    this.material?.dispose();
  }
}
