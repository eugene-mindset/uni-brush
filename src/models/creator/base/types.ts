import { Entity } from "@/models";
import { ValuePipeline } from "./value-pipeline";

export type propertyToPipeline<T extends Entity.Base.EntityType> = {
  [key in keyof T]?: ValuePipeline<T[key]>;
};

export type propertyToValues<T extends Entity.Base.EntityType> = {
  [key in keyof T]?: T[key][];
};
