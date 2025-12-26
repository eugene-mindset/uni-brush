import * as THREE from "three";

import { Entity } from "@/models";
import { ThreeHelpers } from "@/util";

import { BaseVisual } from "./visual-models";

export class RenderPipelineIntersection {
  private _intersect: THREE.Intersection<THREE.Object3D>;
  private _visual?: BaseVisual;
  private _entity?: Entity.EntityBase;
  private _type?: Entity.EntityTypes;

  public constructor(intersect: THREE.Intersection<THREE.Object3D>) {
    this._intersect = intersect;
    const userData = intersect.object.userData.visualRef
      ? intersect?.object.userData
      : ThreeHelpers.findAncestor(intersect.object, (anc) => !!anc.userData?.visualRef)?.userData;

    if (!userData) return;

    this._visual = userData?.visualRef as BaseVisual;
    this._entity = this._visual.entity;
    this._type = this._visual.entity.type;
  }

  public static createFromObject(obj: THREE.Object3D) {
    return new RenderPipelineIntersection({ object: obj } as THREE.Intersection<THREE.Object3D>);
  }

  public get intersect() {
    return this._intersect;
  }

  public get visual() {
    return this._visual;
  }

  public get entity() {
    return this._entity;
  }

  public get entityType() {
    return this._type;
  }
}
