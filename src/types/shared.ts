export interface IConstructor<T> {
  new (...args: any[]): T;

  // Or enforce default constructor
  // new (): T;
}

export type DeepReadonly<T> = T extends Function
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
