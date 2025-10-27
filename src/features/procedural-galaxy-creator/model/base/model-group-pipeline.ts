import { ModelGenerator } from "./model-generator";
import { ModelOperator } from "./model-operator";

export class ModelGroup {
  private _entityCount: number = 1000;
  private _generator?: ModelGenerator<any, any>;
  private _operators: ModelOperator<any, any, any>[] = [];

  public constructor(count: number) {
    this._entityCount = count;
  }

  // properties

  public get generator(): ModelGenerator<any, any> | undefined {
    return this._generator;
  }

  public get operators(): ModelOperator<any, any, any>[] {
    return [...this._operators];
  }

  public get entityCount(): number {
    return this._entityCount;
  }

  public set entityCount(count: number) {
    this.entityCount = count;
    this.reset();
  }

  // group methods

  public get initialInput(): readonly any[] {
    if (!this._generator) return [];

    return this._generator.outputs;
  }

  public get finalOutput(): readonly any[] {
    if (this._operators.length === 0) return this._generator?.outputs || [];
    return this._operators[this._operators.length - 1].outputs;
  }

  public generate() {
    if (!this._generator) return;

    this._generator.generate();
    const initialInput = this._generator.outputs;

    this._operators.forEach((element, i, arr) => {
      const inputs = i > 0 ? arr[i - 1].outputs : initialInput;

      element.setInputs([...inputs]);
      element.generate();
    });
  }

  public reset() {
    this._operators.forEach((element) => {
      element.reset();
    });
  }

  // generator

  public setGenerator(generator?: typeof ModelGenerator<any, any>) {
    this._generator = generator?.create(this._entityCount);
    this.reset();
  }

  public configGenerator(config: Object) {
    this._generator?.setConfig(config);
    this.reset();
  }

  // operators

  public addOperator(operator: ModelOperator<any, any, any>, index?: number) {
    if (!index) {
      this._operators.push(operator);
    } else {
      this._operators.splice(index, 0, operator);
    }

    this.reset();
  }

  public createOperator(operator: typeof ModelOperator<any, any, any>) {
    this._operators.push(operator.create());
  }

  public removeOperator(index: number) {
    this._operators.splice(index, 1);
    this.reset();
  }

  public duplicateOperator(index: number) {
    const clone = this._operators[index].clone();
    this.addOperator(clone);
  }

  public configOperator(index: number, config: Object) {
    this._operators[index].setConfig(config);
    this.reset();
  }
}
