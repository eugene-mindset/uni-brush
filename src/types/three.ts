import { Entity } from "@/models";
import { BaseVisual } from "@/renderer";

export interface RenderIntersectData {
  refVisual?: BaseVisual;
  refEntity?: Entity.EntityBase;
  refType?: Entity.EntityTypes;
}
