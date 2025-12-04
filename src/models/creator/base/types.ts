import { Entity } from "@/models";
import { ValuePipeline } from "./value-pipeline";

export type propertyToPipeline<T extends Entity.EntityBase> = {
  [key in keyof T]?: ValuePipeline<T[key]>;
};

export type propertyToValues<T extends Entity.EntityBase> = {
  [key in keyof T]?: T[key][];
};
