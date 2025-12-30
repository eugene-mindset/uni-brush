"use no memo"; // mutable object - entity factory

import { createStore, Provider } from "jotai";
import { useCallback, useMemo } from "react";

import { Panel, ToggleComponent } from "@/components";
import { useForceRender } from "@/hooks";
import { Creator, Entity, EntityTypes } from "@/models";

import { creatorEntityFactoryTypeAtom } from "../store";
import { CreatorPropertiesFactoryEditor } from "./creator-properties-factory";
import { CreatorSectionToolbar } from "./creator-section-toolbar";

export interface Props<K extends object, V extends Entity.EntityBase<K>> {
  entityFactory: Creator.Base.EntityFactory<K, V>;
  entity: EntityTypes;
}

export const CreatorEntityFactoryEditor = <K extends object, V extends Entity.EntityBase<K>>(
  props: Props<K, V>,
) => {
  const { entityFactory, entity } = props;
  const { forceRender } = useForceRender();

  const onAdd = useCallback(() => {
    // TODO: get default counts for each entity
    entityFactory.createFactory(1000);
    forceRender();
  }, [entityFactory, forceRender]);

  const onDelete = useCallback(
    (index: number) => {
      entityFactory.deleteFactory(index);
      forceRender();
    },
    [entityFactory, forceRender],
  );

  const onMoveUp = useCallback(
    (index: number) => {
      entityFactory.moveFactory(index, "up");
      forceRender();
    },
    [entityFactory, forceRender],
  );

  const onMoveDown = useCallback(
    (index: number) => {
      entityFactory.moveFactory(index, "down");
      forceRender();
    },
    [entityFactory, forceRender],
  );

  const onChangePropertiesFactoryName = useCallback(
    (index: number, name: string) => {
      entityFactory.setFactoryName(index, name);
      forceRender();
    },
    [entityFactory, forceRender],
  );

  const onChangePropertiesFactoryCount = useCallback(
    (index: number, count: number) => {
      entityFactory.setFactoryCount(index, count);
      forceRender();
    },
    [entityFactory, forceRender],
  );

  const store = useMemo(() => {
    const newStore = createStore();
    newStore.set(creatorEntityFactoryTypeAtom, entity);
    return newStore;
  }, [entity]);

  return (
    <Provider store={store}>
      <div className="form-list">
        <ToggleComponent isInitShown>
          <Panel.Header canToggle="header-big" className="flex-row gap">
            <h2 className="flex-fill">{entity}</h2>
            <CreatorSectionToolbar onAdd={onAdd} />
          </Panel.Header>
          <ToggleComponent.Area>
            <Panel.Group>
              {entityFactory.factories.map((propertiesFactory, index) => (
                <CreatorPropertiesFactoryEditor<K>
                  key={`entity-factory-${propertiesFactory.name}`}
                  propertiesFactory={propertiesFactory.factory}
                  name={propertiesFactory.name}
                  count={propertiesFactory.count}
                  order={index}
                  onDelete={() => onDelete(index)}
                  onMoveUp={index > 0 ? () => onMoveUp(index) : undefined}
                  onMoveDown={
                    index < entityFactory.factories.length - 1 ? () => onMoveDown(index) : undefined
                  }
                  onChangeName={(name: string) => onChangePropertiesFactoryName(index, name)}
                  onChangeCount={(count: number) => onChangePropertiesFactoryCount(index, count)}
                />
              ))}
            </Panel.Group>
          </ToggleComponent.Area>
        </ToggleComponent>
      </div>
    </Provider>
  );
};
