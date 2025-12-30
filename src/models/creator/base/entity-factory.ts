import { Entity } from "@/models";

import { EntityPipeline } from "./entity-pipeline";
import { propertyToValues } from "./types";

type EntityFactoryConfig<K> = {
  pipeline: EntityPipeline<K>;
  count: number;
  name: string;
}[];

export class EntityFactory<K extends object, T extends Entity.EntityBase<K>> {
  protected _pipelines: EntityFactoryConfig<K> = [];

  // constructors

  public constructor() {
    /* empty */
  }

  // properties

  public get pipelines(): EntityFactoryConfig<K> {
    return this._pipelines.map((x) => ({ ...x }));
  }

  // methods

  public createPipeline(count: number, name?: string): EntityPipeline<K> {
    const pipeline = new EntityPipeline<K>();
    this._pipelines.push({
      pipeline,
      count,
      name: name || `Entity Pipeline ${this._pipelines.length + 1}`,
    });

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

  public movePipeline(index: number, dir: "up" | "down") {
    const delta = dir === "up" ? -1 : 1;
    const dest = index + delta;

    if (dest < 0 || dest >= this._pipelines.length) {
      return;
    }

    const temp = this._pipelines[index];
    this._pipelines[index] = this._pipelines[dest];
    this._pipelines[dest] = temp;
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

  public getOutputs(): propertyToValues<K> {
    const out: propertyToValues<K> = {};

    this._pipelines.map((pipeline) => {
      pipeline.pipeline.properties.forEach((key) => {
        if (key in out) return;
        out[key as keyof K] = [];
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
