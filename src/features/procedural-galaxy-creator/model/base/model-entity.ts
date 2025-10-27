import { MathHelpers } from "@/util";
import { ModelOperator } from "./model-operator";
import { ModelGroup } from "./model-group-pipeline";
import { ModelGenerator } from "./model-generator";

interface ModelOperatorIndex {
  group: number;
  operator: number;
}

export class ModelEntityCreator {
  public readonly ENTITY_COUNT: number = 100000;

  private _groups: ModelGroup[] = [];

  public constructor() {}

  // properties

  public get groups(): ModelGroup[] {
    return [...this._groups];
  }

  public get entityCount(): number {
    return this._groups.map((x) => x.entityCount).reduce((a, x) => a + x);
  }

  // groups

  public createGroup(count: number) {
    this._groups.push(new ModelGroup(count));
  }

  public addGroup(group: ModelGroup) {
    this._groups.push(group);
  }

  public deleteGroup(index: number) {
    this._groups.splice(index, 1);
  }

  public setCountForGroup(index: ModelOperatorIndex, count: number) {
    const currentGroupCount = this._groups[index.group].entityCount;
    const actualAdjustment = MathHelpers.clamp(
      count,
      0,
      this.ENTITY_COUNT - this.entityCount - currentGroupCount
    );

    this._groups[index.group].entityCount = actualAdjustment;
  }

  // generators

  public setGenerator(index: number, generator: typeof ModelGenerator<any, any>) {
    this._groups[index].setGenerator(generator);
  }

  public configGenerator(index: number, config: Object) {
    this._groups[index].configGenerator(config);
  }

  // operators

  public createOperator(index: number, operator: typeof ModelOperator<any, any, any>) {
    this._groups[index].createOperator(operator);
  }

  public moveOperator(initIndex: ModelOperatorIndex, finalIndex: ModelOperatorIndex) {
    const operator = this._groups[initIndex.group].operators[initIndex.operator];

    this._groups[finalIndex.group].addOperator(operator, finalIndex.operator);
  }

  public removeOperator(index: ModelOperatorIndex) {
    this._groups[index.group].removeOperator(index.operator);
  }

  public configOperator(index: ModelOperatorIndex, config: Object) {
    this._groups[index.group].configOperator(index.operator, config);
  }

  public duplicateOperator(index: ModelOperatorIndex) {
    this._groups[index.group].duplicateOperator(index.operator);
  }

  // generate

  public generate() {
    this._groups.forEach((group) => {
      group.generate();
    });
  }
}
