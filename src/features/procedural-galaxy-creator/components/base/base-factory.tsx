import { Panel } from "@/components";
import { Creator, Entity, EntityTypes } from "@/models";

import styles from "../../style.module.css";
import { BasePipelineComponent } from "./base-pipeline";

interface Props<V extends Entity.EntityBase> {
  factory: Creator.Base.EntityFactory<V>;
  entity: EntityTypes;
}

export const BaseFactoryComponent = <V extends Entity.EntityBase>(props: Props<V>) => {
  const { factory, entity } = props;
  return (
    <div className="form-list">
      <Panel.Header>
        <h2>{entity}</h2>
      </Panel.Header>
      <Panel.Group>
        {factory.pipelines.map((entityPipeline, index) => (
          <div key={`${entityPipeline.name}_${index}`} className={styles.entity_pipeline}>
            <Panel.Header>
              <h3>{entityPipeline.name}</h3>
            </Panel.Header>
            <div className="flex-col gap margin-block">
              {/* TODO: make real inputs */}
              <Panel.Input labelText="Name" value={entityPipeline.name} />
              <Panel.Input labelText="Count" value={entityPipeline.count} />
            </div>
            {Object.keys(entityPipeline.pipeline.pipelines).map((x) => {
              const pipeline =
                entityPipeline.pipeline.pipelines[
                  x as keyof typeof entityPipeline.pipeline.pipelines
                ];
              return pipeline && <BasePipelineComponent key={x} pipeline={pipeline} property={x} />;
            })}
          </div>
        ))}
      </Panel.Group>
    </div>
  );
};
