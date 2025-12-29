import { HTMLInputTypeAttribute } from "react";

import { Creator } from "@/models";

type configTable = {
  [key: string]: {
    header: string;
    config: {
      [key: string]: {
        type: HTMLInputTypeAttribute | "vector" | "select";
        text?: string;
        selectOptions?: { text: string; value: string | number }[];
      };
    };
  };
};

// TODO: move these settings to classes, like a view model property

export const StepConfigTable: configTable = {
  [Creator.Generators.NormalDistributionVector.stepKey]: {
    header: "Normal Distribution",
    config: {
      normalDev: {
        type: "number",
        text: "Normal Deviation Ratio",
      },
      dim: {
        type: "vector",
        text: "Dimensions",
      },
    },
  },
  [Creator.Generators.DefaultValue.stepKey]: {
    header: "Default Value",
    config: {
      defaultValue: {
        type: "text",
        text: "Default Value",
      },
    },
  },
  [Creator.Operators.BasicGravity.stepKey]: {
    header: "Basic Gravity",
    config: {
      size: {
        type: "vector",
        text: "Size",
      },
      location: {
        type: "vector",
        text: "Position",
      },
      strength: {
        type: "number",
        text: "Strength",
      },
      falloff: {
        type: "number",
        text: "Fall Off",
      },
    },
  },
  [Creator.Operators.ArmGravity.stepKey]: {
    header: "Arm Gravity",
    config: {
      dim: {
        type: "vector",
        text: "Arm Space Size",
      },
      normalSpread: {
        type: "number",
        text: "Normal Deviation Ratio",
      },
      armCount: {
        type: "number",
        text: "Number of Arms",
      },
      armOffset: {
        type: "number",
        text: "Arm Rotational Offset",
      },
      armSpeed: {
        type: "number",
        text: "Arm Rotational Speed",
      },
      armShape: {
        type: "number",
        text: "Arm Sharpness (whacky)",
      },
      armSpread: {
        type: "number",
        text: "Randomness in Arm",
      },
      armTaperSpread: {
        type: "number",
        text: "Randomness down Arm",
      },
      centerOverArmRatio: {
        type: "number",
        text: "Radius Start",
      },
    },
  },
};

export const AllGenerators = {
  [Creator.Generators.DefaultValue.stepKey]: Creator.Generators.DefaultValue,
  [Creator.Generators.NormalDistributionVector.stepKey]:
    Creator.Generators.NormalDistributionVector,
};

export const AllOperators = {
  [Creator.Operators.BasicGravity.stepKey]: Creator.Operators.BasicGravity,
  [Creator.Operators.ArmGravity.stepKey]: Creator.Operators.ArmGravity,
};

export default { StepConfigTable, AllGenerators, AllOperators };
