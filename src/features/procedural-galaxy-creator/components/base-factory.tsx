import { Ref, useImperativeHandle, useRef, useState } from "react";

import { ActionOnlyButton, Panel, SVGIcons, ToggleComponent } from "@/components";
import { useForceRender } from "@/hooks";
import { Creator, Entity, EntityTypes } from "@/models";

import styles from "../style.module.css";
import { BasePipelineComponent } from "./base-pipeline";
import { SectionToolbar } from "./section-toolbar";
import { EditableAttributes } from "./step-config-tables";

interface AddValuePipelineProps<K extends object> {
  ref?: Ref<HTMLDialogElement>;
  options: (keyof K)[];
  onConfirm: (value: keyof K) => void;
  onClose: () => void;
}

const AddValuePipelineModal = <K extends object>({
  ref,
  options,
  ...props
}: AddValuePipelineProps<K>) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const [value, setValue] = useState<keyof K>(options[0] as keyof K);

  useImperativeHandle<HTMLDialogElement | null, HTMLDialogElement | null>(
    ref,
    () => modalRef.current,
    [],
  );

  return (
    <dialog className="true-dialog" ref={modalRef}>
      <Panel maxWidth="500px">
        <Panel.Header className="flex-row">
          <h5 className="flex-fill">Add Value</h5>
          <ActionOnlyButton className="core xs" onClick={() => modalRef.current?.close()}>
            <SVGIcons.Cross />
          </ActionOnlyButton>
        </Panel.Header>
        <Panel.Dropdown
          value={value as string}
          setValue={(x) => setValue(x as keyof K)}
          labelText="Select"
          options={options.map((x) => ({ value: x as string, text: x as string }))}
        />
        <div className="space-top gap flex-row justify-right">
          <button className="core float-right" onClick={() => value && props.onConfirm(value)}>
            Save
          </button>
          <button className="core float-right" onClick={props.onClose}>
            Cancel
          </button>
        </div>
      </Panel>
    </dialog>
  );
};

export interface Props<K extends object, V extends Entity.EntityBase<K>> {
  factory: Creator.Base.EntityFactory<K, V>;
  entity: EntityTypes;
}

export const BaseFactoryComponent = <K extends object, V extends Entity.EntityBase<K>>(
  props: Props<K, V>,
) => {
  const { factory, entity } = props;
  const { forceRender } = useForceRender();
  const addModalRef = useRef<HTMLDialogElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onAddValue = (index: number) => {
    setSelectedIndex(index);
    addModalRef.current?.show();
  };

  const onAddValueConfirm = (value: keyof K) => {
    factory.pipelines[selectedIndex].pipeline.createPipeline(value);
    addModalRef.current?.close();

    forceRender();
  };

  const onAddValueCancel = () => {
    addModalRef.current?.close();
  };
  const onAddEntityPipeline = () => {
    // TODO: get default counts for each entity
    factory.createPipeline(1000);
    forceRender();
  };

  const onDelete = (index: number) => {
    factory.deletePipeline(index);
    forceRender();
  };

  const onMoveUp = (index: number) => {
    factory.movePipeline(index, "up");
    forceRender();
  };

  const onMoveDown = (index: number) => {
    factory.movePipeline(index, "down");
    forceRender();
  };

  return (
    <div className="form-list">
      <ToggleComponent isInitiallyShown>
        <Panel.Header canToggle="header-big" className="flex-row gap">
          <h2 className="flex-fill">{entity}</h2>
          <SectionToolbar onAdd={onAddEntityPipeline} />
        </Panel.Header>
        <ToggleComponent.Area>
          <Panel.Group>
            {factory.pipelines.map((entityPipeline, index) => (
              <div key={`${entityPipeline.name}_${index}`} className={styles.entity_pipeline}>
                <ToggleComponent isInitiallyShown>
                  <Panel.Header canToggle="header-big" className="flex-row gap">
                    <h3 className="flex-fill">{entityPipeline.name}</h3>
                    <SectionToolbar
                      // support duplicate functionality
                      onAdd={() => onAddValue(index)}
                      onDelete={() => onDelete(index)}
                      onMoveDown={
                        index < factory.pipelines.length - 1 ? () => onMoveDown(index) : undefined
                      }
                      onMoveUp={index > 0 ? () => onMoveUp(index) : undefined}
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
      <AddValuePipelineModal
        ref={addModalRef}
        options={EditableAttributes[entity] as (keyof K)[]}
        onConfirm={onAddValueConfirm}
        onClose={onAddValueCancel}
      />
    </div>
  );
};
