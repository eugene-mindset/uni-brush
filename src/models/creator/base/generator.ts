import { Step } from "./step";

export abstract class Generator<O, K extends object> extends Step<O, K> {
  public static readonly stepKey: string = "Generator";

  // properties

  public override get stepKey(): string {
    return Generator.stepKey;
  }

  // methods

  public static create(): Generator<unknown, object> {
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
