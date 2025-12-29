import { Panel, ToggleComponent } from "@/components";
import { Creator, Entity, EntityTypes } from "@/models";

import styles from "../style.module.css";
import { BasePipelineComponent } from "./base-pipeline";
import { SectionToolbar } from "./section-toolbar";

interface Props<V extends Entity.EntityBase> {
  factory: Creator.Base.EntityFactory<V>;
  entity: EntityTypes;
}

export const BaseFactoryComponent = <V extends Entity.EntityBase>(props: Props<V>) => {
  const { factory, entity } = props;
  return (
    <div className="form-list">
      <ToggleComponent isInitiallyShown>
        <Panel.Header canToggle="header-big" className="flex-row gap">
          <h2 className="flex-fill">{entity}</h2>
        </Panel.Header>
        <ToggleComponent.Area>
          <Panel.Group>
            {factory.pipelines.map((entityPipeline, index) => (
              <div key={`${entityPipeline.name}_${index}`} className={styles.entity_pipeline}>
                <ToggleComponent isInitiallyShown>
                  <Panel.Header canToggle="header-big" className="flex-row gap">
                    <h3 className="flex-fill">{entityPipeline.name}</h3>
                    <SectionToolbar
                      onAdd={() => null}
                      onDuplicate={() => null}
                      onDelete={() => null}
                      onMoveUp={() => null}
                      onMoveDown={() => null}
                    />
                  </Panel.Header>
                  <ToggleComponent.Area>
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
                      return (
                        pipeline && (
                          <BasePipelineComponent key={x} pipeline={pipeline} property={x} />
                        )
                      );
                    })}
                  </ToggleComponent.Area>
                </ToggleComponent>
              </div>
            ))}
          </Panel.Group>
        </ToggleComponent.Area>
      </ToggleComponent>
    </div>
  );
};
