import { Ref, useImperativeHandle, useMemo, useRef, useState } from "react";

import { ActionOnlyButton, Panel } from "@/components";
import { SVGIcons } from "@/components";

import { AllGenerators, AllOperators } from "./step-config-tables";

interface SetStateModalProps {
  ref?: Ref<HTMLDialogElement>;
  index: number;
  onConfirm: (stepKey: string) => void;
  onClose: () => void;
}

export const CreatorSetStepModal = ({ ref, ...props }: SetStateModalProps) => {
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
        <div className="mg-top gap flex-row justify-right">
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
