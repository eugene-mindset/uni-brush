import { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { Vector3 } from "three";

import { Creator, Entity } from "@/models";

const initModel = () => {
  const model = new Creator.Base.EntityFactory<Entity.StarSystem.EntityType>();
  const mainEntityPipe = model.createPipeline(1750, "Primary Shape");
  mainEntityPipe.createPipeline("initialPosition");
  mainEntityPipe.createPipeline("name");

  mainEntityPipe.pipelines["initialPosition"]?.setGenerator(
    Creator.Generators.NormalDistributionVector
  );
  mainEntityPipe.pipelines["initialPosition"]?.createOperator(Creator.Operators.BasicGravity);
  mainEntityPipe.pipelines["initialPosition"]?.createOperator(Creator.Operators.ArmGravity);

  mainEntityPipe.pipelines["name"]?.setGenerator(Creator.Generators.DefaultValue<string>);
  mainEntityPipe.pipelines["name"]?.generator?.setConfig({ defaultValue: "Primary Star" });

  const testEntityPipe = model.createPipeline(750, "Secondary Shape");
  testEntityPipe.createPipeline("initialPosition");
  testEntityPipe.createPipeline("name");

  testEntityPipe.pipelines["initialPosition"]?.setGenerator(
    Creator.Generators.NormalDistributionVector
  );

  testEntityPipe.pipelines["name"]?.setGenerator(Creator.Generators.DefaultValue<string>);
  testEntityPipe.pipelines["name"]?.generator?.setConfig({ defaultValue: "Secondary Star" });

  return model;
};

export const useProceduralCreatorModel = () => {
  const coreModelRef = useSignal(initModel());

  const generate = (_event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    coreModelRef.value.generate();
    const outputs = coreModelRef.value.getOutputs();

    Entity.StarSystem.Manager.fullReset();
    Entity.StarSystem.Manager.batchInitializeProperty(
      "initPos",
      outputs.initialPosition as Vector3[]
    );
    Entity.StarSystem.Manager.batchInitializeProperty("name", outputs.name as string[]);
  };

  return {
    coreModel: coreModelRef.value,
    generate,
  };
};
