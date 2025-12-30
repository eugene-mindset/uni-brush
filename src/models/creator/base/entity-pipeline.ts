import { propertyToPipeline, propertyToValues } from "./types";
import { ValuePipeline } from "./value-pipeline";

export class EntityPipeline<K> {
  protected _propertyPipeline: propertyToPipeline<K> = {};

  // constructors

  public constructor() {
    /* empty */
  }

  // properties

  public get pipelines(): propertyToPipeline<K> {
    return { ...this._propertyPipeline };
  }

  public get properties(): string[] {
    return Object.keys(this._propertyPipeline);
  }

  // methods

  public createPipeline(property: keyof K): ValuePipeline<K[keyof K]> {
    if (property === "type" || property === "publicId")
      throw new Error("Cannot define pipeline for manager attributes");
    if (this._propertyPipeline[property]) throw new Error("Already have pipeline for property");

    this._propertyPipeline[property] = new ValuePipeline<K[keyof K]>();
    return this._propertyPipeline[property];
  }

  public deletePipeline(property: keyof K) {
    this._propertyPipeline[property] = undefined;
  }

  public generate(count: number) {
    this.properties.map((x) => {
      const pipeline = this._propertyPipeline[x as keyof K];
      if (!pipeline) return;

      pipeline.generate(count);
    });
  }

  public reset() {
    this.properties.map((x) => {
      const pipeline = this._propertyPipeline[x as keyof K];
      if (!pipeline) return;

      pipeline.reset();
    });
  }

  public getOutputs(): propertyToValues<K> {
    const out: propertyToValues<K> = {};
    this.properties.map((x) => {
      const pipeline = this._propertyPipeline[x as keyof K];
      if (!pipeline) return;

      out[x as keyof K] = pipeline.output;
    });

    return out;
  }
}
