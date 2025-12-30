"use no memo"; // mutable entity - properties factory

import { useAtomValue } from "jotai";
import { useCallback, useRef } from "react";

import { Panel, ToggleComponent } from "@/components";
import { useForceRender } from "@/hooks";
import { Creator } from "@/models";

import { creatorEntityFactoryTypeAtom } from "../store";
import styles from "../style.module.css";
import { CreatorAddValueFactoryModal } from "./creator-add-value-factory-modal";
import { CreatorSectionToolbar } from "./creator-section-toolbar";
import { CreatorValueFactoryEditor } from "./creator-value-factory";
import { EditableAttributes } from "./step-config-tables";

interface Props<K extends object> {
  propertiesFactory: Creator.Base.PropertiesFactory<K>;
  name: string;
  count: number;
  order: number;
  onDelete: () => void;
  onMoveDown?: () => void;
  onChangeName: (name: string) => void;
  onChangeCount: (count: number) => void;
  onMoveUp?: () => void;
}

export const CreatorPropertiesFactoryEditor = <K extends object>({
  propertiesFactory,
  name,
  order,
  count,
  ...props
}: Props<K>) => {
  const { forceRender } = useForceRender();
  const entity = useAtomValue(creatorEntityFactoryTypeAtom);

  const addModalRef = useRef<HTMLDialogElement>(null);

  const onAdd = useCallback(() => {
    addModalRef.current?.show();
  }, []);

  const onAddConfirm = useCallback(
    (value: keyof K) => {
      propertiesFactory.createFactory(value);
      addModalRef.current?.close();

      forceRender();
    },
    [forceRender, propertiesFactory],
  );

  const onAddCancel = useCallback(() => {
    addModalRef.current?.close();
  }, []);

  return (
    <div className={styles.entity_factory}>
      <ToggleComponent isInitiallyShown>
        <Panel.Header canToggle="header-big" className="flex-row gap">
          <h3 className="flex-fill">{name}</h3>
          <CreatorSectionToolbar
            // TODO: support duplicate functionality
            onAdd={onAdd}
            onDelete={props.onDelete}
            onMoveDown={props.onMoveDown}
            onMoveUp={props.onMoveUp}
          />
        </Panel.Header>
        <ToggleComponent.Area>
          <div className="flex-col gap mg-block">
            {/* TODO: make real inputs */}
            <Panel.Input
              labelText="Name"
              value={name}
              onInput={(e) => props.onChangeName(e.currentTarget.value)}
            />
            <Panel.Input
              labelText="Count"
              value={count}
              onInput={(e) => props.onChangeCount(parseInt(e.currentTarget.value))}
            />
          </div>
          {Object.keys(propertiesFactory.factories).map((x) => {
            const pipeline =
              propertiesFactory.factories[x as keyof typeof propertiesFactory.factories];
            return (
              pipeline && (
                <CreatorValueFactoryEditor
                  key={`value-pipe-${x}`}
                  valueFactory={pipeline}
                  property={x}
                />
              )
            );
          })}
        </ToggleComponent.Area>
      </ToggleComponent>
      <CreatorAddValueFactoryModal
        ref={addModalRef}
        options={EditableAttributes[entity] as (keyof K)[]}
        onConfirm={onAddConfirm}
        onClose={onAddCancel}
      />
    </div>
  );
};
