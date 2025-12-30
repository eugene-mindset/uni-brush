import { Ref, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import React from "react";

import { ActionOnlyButton, Panel, SVGIcons, ToggleComponent } from "@/components";
import { useForceRender } from "@/hooks";
import { Creator } from "@/models";

import { BaseStepComponent } from "./base-step";
import { SectionToolbar } from "./section-toolbar";
import ConfigTables from "./step-config-tables";

const { AllGenerators, AllOperators } = ConfigTables;

interface SetStateModalProps {
  ref?: Ref<HTMLDialogElement>;
  index: number;
  onConfirm: (stepKey: string) => void;
  onClose: () => void;
}

const SetStateModal = React.memo(({ ref, ...props }: SetStateModalProps) => {
  const { index } = props;
  const typeText = useMemo(() => (index > -1 ? "Operator" : "Generator"), [index]);

  const modalRef = useRef<HTMLDialogElement>(null);

  const options = useMemo(() => (index > -1 ? AllOperators : AllGenerators), [index]);
  const dropdownOptions = useMemo(
    () => Object.keys(options).map((x) => ({ value: x, text: x })),
    [options],
  );
  const [value, setValue] = useState<string>(Object.keys(options)[0]);

  useImperativeHandle<HTMLDialogElement | null, HTMLDialogElement | null>(
    ref,
    () => modalRef.current,
    [],
  );

  return (
    <dialog className="true-dialog" ref={modalRef}>
      <Panel maxWidth="500px">
        <Panel.Header className="flex-row">
          <h5 className="flex-fill">
            Step {index !== undefined ? index + 2 : 1}: Set {typeText}
          </h5>
          <ActionOnlyButton className="core xs" onClick={() => modalRef.current?.close()}>
            <SVGIcons.Cross />
          </ActionOnlyButton>
        </Panel.Header>
        <Panel.Dropdown
          value={value}
          setValue={(x) => setValue(x as string)}
          labelText="Select"
          options={dropdownOptions}
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
});
SetStateModal.displayName = "SetStateModel";

type MappedPipelineListRef = {
  forceRender: () => void;
};

interface MappedPipelineProps<V, T extends Creator.Base.ValuePipeline<V>> {
  pipeline: T;
  onSetStep: (number) => void;
  ref?: Ref<MappedPipelineListRef>;
}

const MappedPipelineList = <V, T extends Creator.Base.ValuePipeline<V>>({
  ref,
  pipeline,
  onSetStep,
}: MappedPipelineProps<V, T>) => {
  // eslint-disable-next-line react-compiler/react-compiler
  "use no memo"; // we need the pipeline to not be memo'd since it its mutable

  const { forceRender, forceRenderKey } = useForceRender();

  const onDeleteGenerator = React.useCallback(() => {
    pipeline.setGenerator();
    forceRender();
  }, [pipeline, forceRender]);

  const onDeleteOperator = React.useCallback(
    (index: number) => {
      pipeline.removeOperator(index);
      forceRender();
    },
    [pipeline, forceRender],
  );

  const onDuplicateOperator = React.useCallback(
    (index: number) => {
      pipeline.duplicateOperator(index);
      forceRender();
    },
    [pipeline, forceRender],
  );

  const onMoveStep = React.useCallback(
    (index: number, dir: "up" | "down") => {
      pipeline.moveOperator(index, dir);
      forceRender();
    },
    [pipeline, forceRender],
  );

  useImperativeHandle(ref, () => {
    return {
      forceRender,
    };
  }, [forceRender]);

  return (
    <div data-version={forceRenderKey}>
      {pipeline?.generator && (
        <BaseStepComponent
          key={`x.stepKey_-1`}
          step={pipeline.generator}
          order={1}
          onDelete={onDeleteGenerator}
          onSet={() => onSetStep(-1)}
        />
      )}
      {pipeline?.operators &&
        pipeline.operators.map((x, i) => (
          <BaseStepComponent
            key={`x.stepKey_${i}`}
            step={x}
            order={i + 2}
            onDelete={() => onDeleteOperator(i)}
            onDuplicate={() => onDuplicateOperator(i)}
            onSet={() => onSetStep(i)}
            onMoveUp={i > 0 ? () => onMoveStep(i, "up") : undefined}
            onMoveDown={i < pipeline.operators.length - 1 ? () => onMoveStep(i, "down") : undefined}
          />
        ))}
    </div>
  );
};

export interface Props<V, T extends Creator.Base.ValuePipeline<V>> {
  pipeline: T;
  property?: string;
}

export const BasePipelineComponent = <V, T extends Creator.Base.ValuePipeline<V>>(
  props: Props<V, T>,
) => {
  // eslint-disable-next-line react-compiler/react-compiler
  "use no memo"; // force rerender despite content being collapsed

  const { pipeline } = props;

  const setModalRef = useRef<HTMLDialogElement>(null);
  const addModalRef = useRef<HTMLDialogElement>(null);

  const pipelineListRef = useRef<MappedPipelineListRef>(null);
  const { forceRender } = useForceRender();

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const onSetStep = useCallback((index: number) => {
    setSelectedIndex(index);
    setModalRef.current?.show();
  }, []);

  const onSetStepConfirm = useCallback(
    (stepKey: string) => {
      if (!selectedIndex) return;

      if (selectedIndex < 0) {
        const generator = AllGenerators[stepKey];
        pipeline.setGenerator(generator);
      } else {
        const operator = AllOperators[stepKey];
        pipeline.setOperator(selectedIndex, operator);
      }

      setModalRef.current?.close();
      pipelineListRef.current?.forceRender();
      forceRender();
    },
    [selectedIndex, pipeline, forceRender],
  );

  const onSetStepCancel = useCallback(() => {
    setModalRef.current?.close();
  }, []);

  const onAddStep = useCallback(() => {
    if (!pipeline.generator) {
      onSetStep(-1);
    } else {
      addModalRef.current?.show();
    }
  }, [pipeline.generator, onSetStep]);

  const onAddStepConfirm = useCallback(
    (stepKey: string) => {
      const operator = AllOperators[stepKey];
      pipeline.createOperator(operator);
      addModalRef.current?.close();
      pipelineListRef.current?.forceRender();
      forceRender();
    },
    [pipeline, forceRender],
  );

  const onAddStepCancel = useCallback(() => {
    addModalRef.current?.close();
  }, []);

  return (
    <>
      <Panel.Group>
        <ToggleComponent>
          <Panel.Header canToggle="header-big" className="flex-row gap">
            <h4 className="flex-fill">{props?.property}</h4>
            <SectionToolbar onAdd={onAddStep} />
          </Panel.Header>
          <ToggleComponent.Area>
            <MappedPipelineList ref={pipelineListRef} pipeline={pipeline} onSetStep={onSetStep} />
          </ToggleComponent.Area>
        </ToggleComponent>
      </Panel.Group>
      <SetStateModal
        ref={setModalRef}
        index={selectedIndex}
        onConfirm={onSetStepConfirm}
        onClose={onSetStepCancel}
      />
      <SetStateModal
        ref={addModalRef}
        index={pipeline.operators.length}
        onConfirm={onAddStepConfirm}
        onClose={onAddStepCancel}
      />
    </>
  );
};
