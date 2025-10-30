import { Step } from "./step";

export abstract class Generator<O, K extends Object> extends Step<O, K> {
  public readonly stepKey: string = "Generator";
  // methods

  public static create(): Generator<any, any> {
    throw new Error("Cannot call static of abstract class");
  }

  public abstract clone(): Generator<O, K>;

  public generate(count: number): O[] {
    const out: O[] = [];

    for (let i = 0; i < count; i++) {
      out.push(this.generateStep(i));
    }

    return out;
  }
}
