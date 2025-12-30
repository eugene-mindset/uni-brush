import { propertyToFactory, propertyToValues } from "./types";
import { ValueFactory } from "./value-factory";

export class PropertiesFactory<K extends object> {
  protected _valueFactories: propertyToFactory<K> = {};

  // constructors

  public constructor() {
    /* empty */
  }

  // properties

  public get factories(): propertyToFactory<K> {
    return { ...this._valueFactories };
  }

  public get properties(): string[] {
    return Object.keys(this._valueFactories);
  }

  // methods

  public createFactory(property: keyof K): ValueFactory<K[keyof K]> {
    if (property === "type" || property === "publicId")
      throw new Error("Cannot define factory for manager attributes");
    if (this._valueFactories[property]) throw new Error("Already have factory for property");

    this._valueFactories[property] = new ValueFactory<K[keyof K]>();
    return this._valueFactories[property];
  }

  public deleteFactory(property: keyof K) {
    this._valueFactories[property] = undefined;
  }

  public generate(count: number) {
    this.properties.map((x) => {
      const factory = this._valueFactories[x as keyof K];
      if (!factory) return;

      factory.generate(count);
    });
  }

  public reset() {
    this.properties.map((x) => {
      const factory = this._valueFactories[x as keyof K];
      if (!factory) return;

      factory.reset();
    });
  }

  public getOutputs(): propertyToValues<K> {
    const out: propertyToValues<K> = {};
    this.properties.map((x) => {
      const factory = this._valueFactories[x as keyof K];
      if (!factory) return;

      out[x as keyof K] = factory.output;
    });

    return out;
  }
}
