import { FunctionalComponent, JSX } from "preact";
import { useRef } from "preact/hooks";

import { Panel } from "@/components";

import * as CreatorView from "./components";
import { Creator, EntityTypes } from "@/models";
import { Entity } from "@/models";
import { Vector3 } from "three";

const initModel = () => {
  const model = new Creator.Base.EntityFactory<Entity.StarSystem.EntityType>();
  const mainEntityPipe = model.createPipeline(1750, "Primary Shape");
  mainEntityPipe.createPipeline("initialPosition");
  mainEntityPipe.createPipeline("name");

  mainEntityPipe.pipelines["initialPosition"]?.setGenerator(Creator.Generators.NormalDistribution);
  mainEntityPipe.pipelines["initialPosition"]?.createOperator(Creator.Operators.BasicGravity);
  mainEntityPipe.pipelines["initialPosition"]?.createOperator(Creator.Operators.ArmGravity);

  mainEntityPipe.pipelines["name"]?.setGenerator(Creator.Generators.DefaultValue<string>);
  mainEntityPipe.pipelines["name"]?.generator?.setConfig({ defaultValue: "Primary Star" });

  const testEntityPipe = model.createPipeline(750, "Secondary Shape");
  testEntityPipe.createPipeline("initialPosition");
  testEntityPipe.createPipeline("name");

  testEntityPipe.pipelines["initialPosition"]?.setGenerator(Creator.Generators.NormalDistribution);

  testEntityPipe.pipelines["name"]?.setGenerator(Creator.Generators.DefaultValue<string>);
  testEntityPipe.pipelines["name"]?.generator?.setConfig({ defaultValue: "Secondary Star" });

  return model;
};

export const ProceduralCreator: FunctionalComponent<{}> = () => {
  const coreModelRef = useRef(initModel());

  const onClickGenerate = (_event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    coreModelRef.current.generate();
    const outputs = coreModelRef.current.getOutputs();
    console.log(coreModelRef);

    Entity.StarSystem.Manager.fullReset();
    Entity.StarSystem.Manager.batchInitializeProperty(
      "initPos",
      outputs.initialPosition as Vector3[]
    );
    Entity.StarSystem.Manager.batchInitializeProperty("name", outputs.name as string[]);
  };

  return (
    <Panel title="Geography / Editor" canToggle width="650px" maxHeight="1000px">
      <Panel.Header>
        <h2>Base Config</h2>
      </Panel.Header>
      <div className="form-list">
        <Panel.Input type="text" labelText="Generator Name" />
        <h3>Entities</h3>
        <div className="grid-5">
          <Panel.Input type="checkbox" labelText="Star Systems" />
          <Panel.Input type="checkbox" labelText="Star Dust" />
          <Panel.Input type="checkbox" labelText="Special Structures" />
          <Panel.Input type="checkbox" labelText="Lanes" />
          <Panel.Input type="checkbox" labelText="Lanes" />
        </div>
      </div>
      <CreatorView.BaseFactoryComponent
        factory={coreModelRef.current}
        entity={EntityTypes.STAR_SYSTEM}
      />
      <div className="space-top gap flex-row justify-right">
        <button className="core float-right">Save</button>
        <button className="core float-right" onClick={onClickGenerate}>
          Generate
        </button>
      </div>
    </Panel>
  );
};
