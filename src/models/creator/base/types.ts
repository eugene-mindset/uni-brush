import { ValueFactory } from "./value-factory";

export type propertyToFactory<T extends object> = {
  [key in keyof T]?: ValueFactory<T[key]>;
};

export type propertyToValues<T extends object> = {
  [key in keyof T]?: T[key][];
};
