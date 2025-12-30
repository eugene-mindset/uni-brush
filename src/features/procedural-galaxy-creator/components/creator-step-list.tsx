"use no memo"; // mutable object - value factory

import { Ref, useCallback, useImperativeHandle } from "react";

import { useForceRender } from "@/hooks";
import { Creator } from "@/models";

import { CreatorStepEditor } from "./creator-step";

export type StepListRefs = {
  forceRender: () => void;
};

interface StepListProps<V, T extends Creator.Base.ValueFactory<V>> {
  valueFactory: T;
  onSetStep: (number) => void;
  ref?: Ref<StepListRefs>;
}

export const CreatorStepList = <V, T extends Creator.Base.ValueFactory<V>>({
  ref,
  valueFactory,
  onSetStep,
}: StepListProps<V, T>) => {
  const { forceRender, forceRenderKey } = useForceRender();

  const onDeleteGenerator = useCallback(() => {
    valueFactory.setGenerator();
    forceRender();
  }, [valueFactory, forceRender]);

  const onDeleteOperator = useCallback(
    (index: number) => {
      valueFactory.removeOperator(index);
      forceRender();
    },
    [valueFactory, forceRender],
  );

  const onDuplicateOperator = useCallback(
    (index: number) => {
      valueFactory.duplicateOperator(index);
      forceRender();
    },
    [valueFactory, forceRender],
  );

  const onMoveStep = useCallback(
    (index: number, dir: "up" | "down") => {
      valueFactory.moveOperator(index, dir);
      forceRender();
    },
    [valueFactory, forceRender],
  );

  useImperativeHandle(ref, () => {
    return {
      forceRender,
    };
  }, [forceRender]);

  return (
    <div data-version={forceRenderKey}>
      {valueFactory?.generator && (
        <CreatorStepEditor
          key={`x.stepKey_-1`}
          step={valueFactory.generator}
          order={1}
          onDelete={onDeleteGenerator}
          onSet={() => onSetStep(-1)}
        />
      )}
      {valueFactory?.operators &&
        valueFactory.operators.map((x, i) => (
          <CreatorStepEditor
            key={`x.stepKey_${i}`}
            step={x}
            order={i + 2}
            onDelete={() => onDeleteOperator(i)}
            onDuplicate={() => onDuplicateOperator(i)}
            onSet={() => onSetStep(i)}
            onMoveUp={i > 0 ? () => onMoveStep(i, "up") : undefined}
            onMoveDown={
              i < valueFactory.operators.length - 1 ? () => onMoveStep(i, "down") : undefined
            }
          />
        ))}
    </div>
  );
};
