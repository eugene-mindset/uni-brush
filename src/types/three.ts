import { BaseVisual } from "@/renderer";
import { Entity } from "@/models";

export interface RenderIntersectData {
  refVisual?: BaseVisual;
  refEntity?: Entity.Base.EntityType;
  refType?: Entity.EntityTypes;
}
