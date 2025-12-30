import { StarSystemAttributes, StarSystemEntity } from "../entities";
import { Base, Generators, Operators } from ".";

export const initModel = () => {
  const model = new Base.EntityFactory<StarSystemAttributes, StarSystemEntity>();
  const mainEntityPipe = model.createFactory(1750, "Primary Shape");
  mainEntityPipe.createFactory("initPos");
  mainEntityPipe.createFactory("name");

  mainEntityPipe.factories["initPos"]?.setGenerator(Generators.NormalDistributionVector);
  mainEntityPipe.factories["initPos"]?.createOperator(Operators.BasicGravity);
  mainEntityPipe.factories["initPos"]?.createOperator(Operators.ArmGravity);

  mainEntityPipe.factories["name"]?.setGenerator(Generators.DefaultValue<string>);
  mainEntityPipe.factories["name"]?.generator?.setConfig({ defaultValue: "Primary Star" });

  const testEntityPipe = model.createFactory(750, "Secondary Shape");
  testEntityPipe.createFactory("initPos");
  testEntityPipe.createFactory("name");

  testEntityPipe.factories["initPos"]?.setGenerator(Generators.NormalDistributionVector);

  const NewType = Generators.DefaultValue<string>;

  testEntityPipe.factories["name"]?.setGenerator(NewType);
  testEntityPipe.factories["name"]?.generator?.setConfig({ defaultValue: "Secondary Star" });

  return model;
};
