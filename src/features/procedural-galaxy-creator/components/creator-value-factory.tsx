"use no memo"; // mutable object - vakye factory

import { useCallback, useRef, useState } from "react";

import { Panel, ToggleComponent } from "@/components";
import { useForceRender } from "@/hooks";
import { Creator } from "@/models";

import { CreatorSectionToolbar } from "./creator-section-toolbar";
import { CreatorSetStepModal } from "./creator-set-step-modal";
import { CreatorStepList, StepListRefs } from "./creator-step-list";
import ConfigTables from "./step-config-tables";

const { AllGenerators, AllOperators } = ConfigTables;

export interface Props<V, T extends Creator.Base.ValueFactory<V>> {
  valueFactory: T;
  property?: string;
}

export const CreatorValueFactoryEditor = <V, T extends Creator.Base.ValueFactory<V>>(
  props: Props<V, T>,
) => {
  const { valueFactory } = props;

  const setModalRef = useRef<HTMLDialogElement>(null);
  const addModalRef = useRef<HTMLDialogElement>(null);

  const valueFactoryListRef = useRef<StepListRefs>(null);
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
        valueFactory.setGenerator(generator);
      } else {
        const operator = AllOperators[stepKey];
        valueFactory.setOperator(selectedIndex, operator);
      }

      setModalRef.current?.close();
      valueFactoryListRef.current?.forceRender();
      forceRender();
    },
    [selectedIndex, valueFactory, forceRender],
  );

  const onSetStepCancel = useCallback(() => {
    setModalRef.current?.close();
  }, []);

  const onAddStep = useCallback(() => {
    if (!valueFactory.generator) {
      onSetStep(-1);
    } else {
      addModalRef.current?.show();
    }
  }, [valueFactory.generator, onSetStep]);

  const onAddStepConfirm = useCallback(
    (stepKey: string) => {
      const operator = AllOperators[stepKey];
      valueFactory.createOperator(operator);
      addModalRef.current?.close();
      valueFactoryListRef.current?.forceRender();
      forceRender();
    },
    [valueFactory, forceRender],
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
            <CreatorSectionToolbar onAdd={onAddStep} />
          </Panel.Header>
          <ToggleComponent.Area>
            <CreatorStepList
              ref={valueFactoryListRef}
              valueFactory={valueFactory}
              onSetStep={onSetStep}
            />
          </ToggleComponent.Area>
        </ToggleComponent>
      </Panel.Group>
      <CreatorSetStepModal
        ref={setModalRef}
        index={selectedIndex}
        onConfirm={onSetStepConfirm}
        onClose={onSetStepCancel}
      />
      <CreatorSetStepModal
        ref={addModalRef}
        index={valueFactory.operators.length}
        onConfirm={onAddStepConfirm}
        onClose={onAddStepCancel}
      />
    </>
  );
};
