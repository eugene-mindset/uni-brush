import { JSXInternal } from "node_modules/preact/src/jsx";

type configTable = {
  [key: string]: {
    header: string;
    config: {
      [key: string]: {
        type: JSXInternal.HTMLInputTypeAttribute | "vector";
        text?: string;
      };
    };
  };
};

// TODO: move these settings to classes, like a view model property

export const StepConfigTable: configTable = {
  "Generator:NormalDistribution": {
    header: "Normal Distribution Generator",
    config: {
      normalDev: {
        type: "number",
        text: "Normal Deviation Ratio",
      },
      dim: {
        type: "vector",
        text: "Galaxy Size",
      },
    },
  },
  "Generator:DefaultValue": {
    header: "Default Value",
    config: {
      defaultValue: {
        type: "text",
        text: "Default Value",
      },
    },
  },
  "Operator:BasicGravity": {
    header: "Basic Gravity Effect",
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
  "Operator:ArmGravity": {
    header: "Arm Gravity Effect",
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

export default StepConfigTable;
