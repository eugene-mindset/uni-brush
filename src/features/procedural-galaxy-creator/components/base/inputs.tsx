import { useState } from "preact/hooks";

import { Panel } from "@/components";

import { Base } from "../../model";
import { JSXInternal } from "node_modules/preact/src/jsx";
import { Vector3 } from "three";

export const updateConfig = <K extends Object, T extends Base.ModelStep<any, K>>(
  step: T,
  newConfig: Partial<K>
) => {
  step.setConfig({ ...step.config, ...newConfig });
};

interface BaseInputProps<K extends Object, T extends Base.ModelStep<any, K>> {
  step: T;
  configKey: keyof K;
  labelText?: string;
}

interface InputProps<K extends Object, T extends Base.ModelStep<any, K>>
  extends BaseInputProps<K, T> {
  inputType: JSXInternal.HTMLInputTypeAttribute;
}

export const ModelStepInput = <K extends Object, T extends Base.ModelStep<any, K>>(
  props: InputProps<K, T>
) => {
  const { step, configKey, inputType } = props;

  const [_value, setValue] = useState(step.config[configKey]);

  const onInput = (value: string) => {
    if (inputType === "number") {
      // TODO: need to fix number inputs not taking negative
      const final = parseFloat(value);
      setValue(final as K[keyof K]);
      updateConfig(step, { [configKey]: final } as Object as K);
    } else {
      setValue(value as K[keyof K]);
      updateConfig(step, { [configKey]: value } as Object as K);
    }
  };

  return (
    <Panel.Input
      type={inputType}
      labelText={props.labelText}
      value={step.config[configKey] as string | number | undefined}
      onInput={(event) => onInput(event.currentTarget.value)}
    />
  );
};

export const ModelStepVectorInput = <K extends Object, T extends Base.ModelStep<any, K>>(
  props: BaseInputProps<K, T>
) => {
  const { step, configKey } = props;

  const [_value, setValue] = useState<Vector3>(step.config[configKey] as Vector3);

  const onInput = (value: Vector3) => {
    setValue(value);
    updateConfig(step, { [configKey]: value } as Object as K);
  };

  return (
    <Panel.VectorInput
      labelText={props.labelText}
      value={step.config[configKey] as Vector3}
      setValue={onInput}
    />
  );
};
