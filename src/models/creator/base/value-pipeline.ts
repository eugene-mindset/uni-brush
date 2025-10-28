import { Generator } from "./generator";
import { Operator } from "./operator";
import { Step } from "./step";

export class ValuePipeline<T> {
  private _generator?: Generator<T, any>;
  private _operators: Operator<T, any>[] = [];

  private _outputs: T[][] = [];

  // properties

  public get generator(): Generator<any, any> | undefined {
    return this._generator;
  }

  public get operators(): Operator<any, any>[] {
    return [...this._operators];
  }

  public get orderOfOperations(): Step<any, any>[] {
    return [this._generator, ...this._operators] as Step<any, any>[];
  }

  public get output(): T[] {
    if (this._outputs.length === 0) return [];
    return this._outputs[this._outputs.length - 1];
  }

  // group methods

  public reset() {
    this._outputs = [];
  }

  public generate(count: number) {
    this.reset();

    if (!this._generator) return;
    this._outputs.push(this._generator.generate(count));

    this._operators.forEach((element) => {
      this._outputs.push(element.generate(this.output));
    });
  }

  // generator

  public setGenerator(generator?: typeof Generator<any, any>) {
    this._generator = generator?.create();
    this.reset();
  }

  public configGenerator(config: Object) {
    this._generator?.setConfig(config);
    this.reset();
  }

  // operators

  public createOperator(operator: typeof Operator<any, any>) {
    this._operators.push(operator.create());
    this.reset();
  }

  public removeOperator(index: number) {
    this._operators.splice(index, 1);
    this.reset();
  }

  public duplicateOperator(index: number) {
    const clone = this._operators[index].clone();
    this._operators.splice(index + 1, 0, clone);
    this.reset();
  }

  public configOperator(index: number, config: Object) {
    this._operators[index].setConfig(config);
    this.reset();
  }
}
