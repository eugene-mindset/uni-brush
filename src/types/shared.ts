import { ReactNode } from "react";

export interface IConstructor<T> {
  new (...args: never[]): T;

  // Or enforce default constructor
  // new (): T;
}
export type ContextProvider<T> = (props: { value: T } & React.PropsWithChildren) => ReactNode;
