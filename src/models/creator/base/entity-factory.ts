import { Entity } from "@/models";

import { PropertiesFactory } from "./properties-factory";
import { propertyToValues } from "./types";

type EntityFactoryConfig<K extends object> = {
  factory: PropertiesFactory<K>;
  count: number;
  name: string;
}[];

export class EntityFactory<K extends object, T extends Entity.EntityBase<K>> {
  protected _factories: EntityFactoryConfig<K> = [];

  // constructors

  public constructor() {
    /* empty */
  }

  // properties

  public get factories(): EntityFactoryConfig<K> {
    return this._factories.map((x) => ({ ...x }));
  }

  // methods

  public createFactory(count: number, name?: string): PropertiesFactory<K> {
    const factory = new PropertiesFactory<K>();
    this._factories.push({
      factory: factory,
      count,
      name: name || `Entity Pipeline ${this._factories.length + 1}`,
    });

    return factory;
  }

  public deleteFactory(index: number) {
    this._factories.splice(index, 1);
  }

  public setFactoryCount(index: number, count: number) {
    this._factories[index].count = count;
  }

  public setFactoryName(index: number, name: string) {
    this._factories[index].name = name;
  }

  public moveFactory(index: number, dir: "up" | "down") {
    const delta = dir === "up" ? -1 : 1;
    const dest = index + delta;

    if (dest < 0 || dest >= this._factories.length) {
      return;
    }

    const temp = this._factories[index];
    this._factories[index] = this._factories[dest];
    this._factories[dest] = temp;
  }

  public generate() {
    this._factories.map((x) => {
      x.factory.generate(x.count);
    });
  }

  public reset() {
    this._factories.map((x) => {
      x.factory.reset();
    });
  }

  public getOutputs(): propertyToValues<K> {
    const out: propertyToValues<K> = {};

    this._factories.map((factory) => {
      factory.factory.properties.forEach((key) => {
        if (key in out) return;
        out[key as keyof K] = [];
      });

      const factoryOut = factory.factory.getOutputs();

      Object.keys(factoryOut).map((key) => {
        const trueKey = key as keyof typeof factoryOut;

        const arr = factoryOut[trueKey] || [];
        if (!((trueKey as keyof T) in factoryOut)) return;

        if (out[trueKey]) {
          out[trueKey].push(...arr);
        }
      });
    });

    return out;
  }
}
