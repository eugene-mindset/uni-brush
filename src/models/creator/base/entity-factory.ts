import { Entity } from "@/models";
import { EntityPipeline } from "./entity-pipeline";
import { propertyToValues } from "./types";

type EntityFactoryConfig<T extends Entity.Base.EntityType> = {
  pipeline: EntityPipeline<T>;
  count: number;
  name: string;
}[];

export class EntityFactory<T extends Entity.Base.EntityType> {
  protected _pipelines: EntityFactoryConfig<T> = [];

  // constructors

  public constructor() {}

  // properties

  public get pipelines(): EntityFactoryConfig<T> {
    return this._pipelines.map((x) => ({ ...x }));
  }

  // methods

  public createPipeline(count: number, name?: string): EntityPipeline<T> {
    const pipeline = new EntityPipeline<T>();
    this._pipelines.push({ pipeline, count, name: name || "Entity Pipeline" });

    return pipeline;
  }

  public deletePipeline(index: number) {
    this._pipelines.splice(index, 1);
  }

  public setPipelineCount(index: number, count: number) {
    this._pipelines[index].count = count;
  }

  public setPipelineName(index: number, name: string) {
    this._pipelines[index].name = name;
  }

  public generate() {
    this._pipelines.map((x) => {
      x.pipeline.generate(x.count);
    });
  }

  public reset() {
    this._pipelines.map((x) => {
      x.pipeline.reset();
    });
  }

  public getOutputs(): propertyToValues<T> {
    let out: propertyToValues<T> = {};

    this._pipelines.map((pipeline) => {
      pipeline.pipeline.properties.forEach((key) => {
        if (key in out) return;
        out[key as keyof T] = [];
      });

      const pipelineOut = pipeline.pipeline.getOutputs();

      Object.keys(pipelineOut).map((key) => {
        const trueKey = key as keyof typeof pipelineOut;

        const arr = pipelineOut[trueKey] || [];
        if (!((trueKey as keyof T) in pipelineOut)) return;

        if (out[trueKey]) {
          out[trueKey].push(...arr);
        }
      });
    });

    return out;
  }
}
