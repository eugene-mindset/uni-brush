import { FunctionalComponent, JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { Panel } from "@/components";

import * as CreatorView from "./components";
import { CreatorModel } from "@/models";
import { Entity } from "@/models";
import { Vector3 } from "three";

const initModel = (model: CreatorModel.Base.ModelEntityPipeline<Entity.StarSystem.EntityType>) => {
  model.createPipeline("initialPosition");
  model.createPipeline("name");

  model.pipelines["initialPosition"]?.setGenerator(CreatorModel.Generators.NormalDistribution);
  model.pipelines["initialPosition"]?.createOperator(CreatorModel.Operators.BasicGravity);
  model.pipelines["initialPosition"]?.createOperator(CreatorModel.Operators.ArmGravity);

  model.pipelines["name"]?.setGenerator(CreatorModel.Generators.DefaultValue<string>);
  model.pipelines["name"]?.generator?.setConfig({ defaultValue: "Test Star" });
};

export const ProceduralCreator: FunctionalComponent<{}> = () => {
  const count = Entity.StarSystem.Manager.capacity;
  const [modelLoaded, setModelLoaded] = useState(false);

  const coreModelRef = useRef(
    new CreatorModel.Base.ModelEntityPipeline<Entity.StarSystem.EntityType>()
  );
  useEffect(() => {
    const model = coreModelRef.current;
    initModel(model);

    setModelLoaded(true);
  }, []);

  const onClickGenerate = (_event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    coreModelRef.current.generate(count);
    const outputs = coreModelRef.current.getOutputs();

    Entity.StarSystem.Manager.fullReset();
    Entity.StarSystem.Manager.batchInitializeProperty(
      "initPos",
      outputs.initialPosition as Vector3[]
    );
    Entity.StarSystem.Manager.batchInitializeProperty("name", outputs.name as string[]);
  };

  return (
    <Panel title="Geography / Editor" canToggle width="650px">
      {modelLoaded && (
        <>
          <Panel.Header>
            <h2>Base Config</h2>
          </Panel.Header>
          <div className="form-list">
            <Panel.Input type="text" labelText="Generator Name" />
            <Panel.Group>
              <Panel.Header>
                <h2>Group 1</h2>
              </Panel.Header>
              {coreModelRef.current.generator && (
                <CreatorView.BaseStepComponent<
                  typeof coreModelRef.current.generator.config,
                  typeof coreModelRef.current.generator
                >
                  step={coreModelRef.current.generator}
                  order={1}
                />
              )}
              {coreModelRef.current.operators &&
                coreModelRef.current.operators.map((x, i) => (
                  <CreatorView.BaseStepComponent<typeof x.config, typeof x>
                    key={`x.stepKey_${i}`}
                    step={x}
                    order={i + 2}
                  />
                ))}
            </Panel.Group>
          </div>
          <div className="space-top gap flex-row justify-right">
            <button className="core float-right">Save</button>
            <button className="core float-right" onClick={onClickGenerate}>
              Generate
            </button>
          </div>
        </>
      )}
    </Panel>
  );
};
