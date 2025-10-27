import { FunctionalComponent, JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { Panel } from "@/components";

import * as CreatorView from "./components";
import * as CreateModel from "./model";
import { ModelValuePipeline } from "./model/base";
import { Entity } from "@/models";
import { Vector3 } from "three";

export const ProceduralCreator: FunctionalComponent<{}> = () => {
  const count = Entity.StarSystem.Manager.capacity;
  const [modelLoaded, setModelLoaded] = useState(false);

  const coreModelRef = useRef(new ModelValuePipeline<Vector3>());
  useEffect(() => {
    const model = coreModelRef.current;
    model.setGenerator(CreateModel.Generators.NormalDistribution);
    model.createOperator(CreateModel.Operators.BasicGravity);
    model.createOperator(CreateModel.Operators.ArmGravity);

    setModelLoaded(true);
  }, []);

  const onClickGenerate = (_event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    coreModelRef.current.generate(count);

    Entity.StarSystem.Manager.fullReset();
    Entity.StarSystem.Manager.batchInitializeProperty("initPos", coreModelRef.current.output);
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
          <div className="space-top">
            <button className="core float-right" onClick={onClickGenerate}>
              Generate
            </button>
          </div>
        </>
      )}
    </Panel>
  );
};
