import { ModelStep } from "../../model/base";

export const updateConfig = <O, K extends Object, T extends ModelStep<O, K>>(
  step: T,
  newConfig: Partial<K>
) => {
  step.setConfig({ ...step.config, ...newConfig });
};
