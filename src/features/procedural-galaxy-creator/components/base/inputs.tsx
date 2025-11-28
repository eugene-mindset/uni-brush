import { HTMLInputTypeAttribute, useState } from "react";

import { Panel } from "@/components";

import { Vector3 } from "three";
import ConfigTables from "./step-config-tables";
import { Creator } from "@/models";

export const updateConfig = <K extends object, T extends Creator.Base.Step<never, K>>(
  step: T,
  newConfig: Partial<K>,
) => {
  step.setConfig({ ...step.config, ...newConfig });
};

export interface BaseInputProps<K extends object, T extends Creator.Base.Step<never, K>> {
  step: T;
  configKey: keyof K;
  labelText?: string;
}

export interface InputProps<K extends object, T extends Creator.Base.Step<never, K>>
  extends BaseInputProps<K, T> {
  inputType: HTMLInputTypeAttribute;
}

export const ModelStepInput = <K extends object, T extends Creator.Base.Step<never, K>>(
  props: InputProps<K, T>,
) => {
  const { step, configKey, inputType } = props;

  const [_value, setValue] = useState(step.config[configKey]);

  const onInput = (value: string) => {
    if (inputType === "number") {
      // TODO: need to fix number inputs not taking negative
      const final = parseFloat(value);
      setValue(final as K[keyof K]);
      updateConfig(step, { [configKey]: final } as object as K);
    } else {
      setValue(value as K[keyof K]);
      updateConfig(step, { [configKey]: value } as object as K);
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

export const ModelStepVectorInput = <K extends object, T extends Creator.Base.Step<never, K>>(
  props: BaseInputProps<K, T>,
) => {
  const { step, configKey } = props;

  const [_value, setValue] = useState<Vector3>(step.config[configKey] as Vector3);

  const onInput = (value: Vector3) => {
    setValue(value);
    updateConfig(step, { [configKey]: value } as object as K);
  };

  return (
    <Panel.Vector
      labelText={props.labelText}
      value={step.config[configKey] as Vector3}
      setValue={onInput}
    />
  );
};

export interface DynamicInputProps<K extends object, T extends Creator.Base.Step<any, K>> {
  step: T;
  configKey: keyof K;
}

export const ModelStepDynamicInput = <K extends object, T extends Creator.Base.Step<any, K>>(
  props: DynamicInputProps<K, T>,
) => {
  const { step, configKey } = props;
  const { StepConfigTable } = ConfigTables;

  const stepProperties = StepConfigTable[step.stepKey];
  const properties = stepProperties.config[configKey as string];

  if (!properties.type) return;
  if (properties.type === "vector") {
    return (
      <ModelStepVectorInput
        key={configKey as string}
        step={step}
        configKey={configKey as keyof K}
        labelText={properties.text}
      />
    );
  } else if (properties.type === "select") {
    return (
      <div>
        Need to create model select component, config: {JSON.stringify(properties.selectOptions)}
      </div>
    );
  } else {
    return (
      <ModelStepInput
        key={configKey as string}
        inputType={properties.type}
        step={step}
        configKey={configKey as keyof K}
        labelText={properties.text}
      />
    );
  }
};
