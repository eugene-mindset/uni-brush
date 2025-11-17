import { forwardRef, Ref, useImperativeHandle, useMemo, useRef, useState } from "preact/compat";

import { ToggleComponent, Panel, ActionOnlyButton, SVGIcons } from "@/components";
import { useTriggerUpdate } from "@/hooks";
import { Creator } from "@/models";

import { BaseStepComponent } from "./base-step";
import ConfigTables from "./step-config-tables";

interface Props<V, T extends Creator.Base.ValuePipeline<V>> {
  pipeline: T;
  property?: string;
}

const { AllGenerators, AllOperators } = ConfigTables;

interface SetStateModalProps {
  index?: number;
  onConfirm: (stepKey: string) => void;
  onClose: () => void;
}

const SetStateModal = forwardRef(
  (props: SetStateModalProps, ref: Ref<HTMLDialogElement | null>) => {
    const { index } = props;
    const typeText = index !== undefined ? (index > -1 ? "Operator" : "Generator") : "";

    const modalRef = useRef<HTMLDialogElement>(null);

    const options = index !== undefined ? (index > -1 ? AllOperators : AllGenerators) : [];
    const [value, setValue] = useState<string>(Object.keys(options)[0]);

    useImperativeHandle(ref, () => modalRef.current, []);

    return (
      <dialog className="true-dialog" ref={modalRef}>
        <Panel maxWidth="500px">
          <Panel.Header className="flex-row">
            <h5 className="flex-fill">
              Step {index !== undefined ? index + 2 : 0}: Set {typeText}
            </h5>
            <ActionOnlyButton className="core xs" onClick={() => modalRef.current?.close()}>
              <SVGIcons.Delete />
            </ActionOnlyButton>
          </Panel.Header>
          <Panel.Dropdown
            value={value}
            setValue={(x) => setValue(x as string)}
            labelText="Select"
            options={Object.keys(options).map((x) => ({ value: x, text: x }))}
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
  }
);

export const BasePipelineComponent = <V, T extends Creator.Base.ValuePipeline<V>>(
  props: Props<V, T>
) => {
  const { pipeline } = props;

  const triggerStateChange = useTriggerUpdate();
  const setModalRef = useRef<HTMLDialogElement>(null);
  const addModalRef = useRef<HTMLDialogElement>(null);

  const [selectedIndex, setSelectedIndex] = useState<number>();

  const onDeleteGenerator = () => {
    pipeline.setGenerator();
    triggerStateChange();
  };

  const onDeleteOperator = (index: number) => {
    pipeline.removeOperator(index);
    triggerStateChange();
  };

  const onDuplicateOperator = (index: number) => {
    pipeline.duplicateOperator(index);
    triggerStateChange();
  };

  const onSetStep = (index: number) => {
    setSelectedIndex(index);
    setModalRef.current?.show();
  };

  const onSetStepConfirm = (stepKey: string) => {
    if (!selectedIndex) return;

    if (selectedIndex < 0) {
      pipeline.setGenerator(AllGenerators[stepKey]);
    } else {
      pipeline.setOperator(selectedIndex, AllOperators[stepKey]);
    }

    setModalRef.current?.close();
    setSelectedIndex(undefined);
    triggerStateChange();
  };

  const onSetStepCancel = () => {
    setModalRef.current?.close();
  };

  const onAddStep = () => {
    addModalRef.current?.show();
  };

  const onAddStepConfirm = (stepKey: string) => {
    pipeline.createOperator(AllOperators[stepKey]);
    addModalRef.current?.close();
    triggerStateChange();
  };

  const onAddStepCancel = () => {
    addModalRef.current?.close();
  };

  const onMoveStep = (index: number, dir: "up" | "down") => {
    pipeline.moveOperator(index, dir);
    triggerStateChange();
  };

  return (
    <>
      <Panel.Group>
        <ToggleComponent>
          <Panel.Header canToggle="header-big" className="flex-row gap">
            <h4 className="flex-fill">{props?.property}</h4>
            <ActionOnlyButton className="core xs" onClick={() => onAddStep()}>
              <SVGIcons.Plus />
            </ActionOnlyButton>
          </Panel.Header>
          <ToggleComponent.Area>
            {pipeline?.generator && (
              <BaseStepComponent
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
                  onMove={(dir: "up" | "down") => onMoveStep(i, dir)}
                />
              ))}
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
