import { Entity } from "@/models";
import { ValuePipeline } from "./value-pipeline";
import { propertyToPipeline, propertyToValues } from "./types";

export class EntityPipeline<T extends Entity.EntityBase> {
  protected _propertyPipeline: propertyToPipeline<T> = {};

  // constructors

  public constructor() {
    /* empty */
  }

  // properties

  public get pipelines(): propertyToPipeline<T> {
    return { ...this._propertyPipeline };
  }

  public get properties(): string[] {
    return Object.keys(this._propertyPipeline);
  }

  // methods

  public createPipeline(property: keyof T): ValuePipeline<T[keyof T]> {
    if (property === "type" || property === "publicId")
      throw new Error("Cannot define pipeline for manager attributes");
    if (this._propertyPipeline[property]) throw new Error("Already have pipeline for property");

    this._propertyPipeline[property] = new ValuePipeline<T[keyof T]>();
    return this._propertyPipeline[property];
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
    const out: propertyToValues<T> = {};
    this.properties.map((x) => {
      const pipeline = this._propertyPipeline[x as keyof T];
      if (!pipeline) return;

      out[x as keyof T] = pipeline.output;
    });

    return out;
  }
}
