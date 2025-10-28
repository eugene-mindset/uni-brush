import { Entity } from "@/models";
import { ModelValuePipeline } from "./model-value-pipeline";

export type propertyToPipeline<T extends Entity.Base.EntityType> = {
  [key in keyof T]?: ModelValuePipeline<T[keyof T]>;
};

export type propertyToValues<T extends Entity.Base.EntityType> = {
  [key in keyof T]?: T[keyof T][];
};

export class ModelEntityPipeline<T extends Entity.Base.EntityType> {
  protected _propertyPipeline: propertyToPipeline<T> = {};

  // constructors

  public constructor() {}

  // properties

  public get pipelines(): propertyToPipeline<T> {
    return {
      ...this._propertyPipeline,
    };
  }

  public get properties(): string[] {
    return Object.keys(this._propertyPipeline);
  }

  // methods

  public createPipeline(property: keyof T) {
    if (property === "type" || property === "publicId")
      throw new Error("Cannot define pipeline for manager attributes");
    if (this._propertyPipeline[property]) throw new Error("Already have pipeline for property");

    this._propertyPipeline[property] = new ModelValuePipeline<T[keyof T]>();
  }

  public deletePipeline(property: keyof T) {
    this._propertyPipeline[property] = undefined;
  }

  public generate(count: number) {
    this.properties.map((x) => {
      const pipeline = this._propertyPipeline[x as keyof T];
      if (!pipeline) return;

      pipeline.generate(count);
    });
  }

  public reset() {
    this.properties.map((x) => {
      const pipeline = this._propertyPipeline[x as keyof T];
      if (!pipeline) return;

      pipeline.reset();
    });
  }

  public getOutputs(): propertyToValues<T> {
    let out: propertyToValues<T> = {};
    this.properties.map((x) => {
      const pipeline = this._propertyPipeline[x as keyof T];
      if (!pipeline) return;

      out[x as keyof T] = pipeline.output;
    });

    return out;
  }
}
