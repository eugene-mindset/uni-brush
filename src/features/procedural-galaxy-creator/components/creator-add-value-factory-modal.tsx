import { Ref, useImperativeHandle, useRef, useState } from "react";

import { ActionOnlyButton, Panel, SVGIcons } from "@/components";

interface ModalProps<K extends object> {
  ref?: Ref<HTMLDialogElement>;
  options: (keyof K)[];
  onConfirm: (value: keyof K) => void;
  onClose: () => void;
}

export const CreatorAddValueFactoryModal = <K extends object>({
  ref,
  options,
  ...props
}: ModalProps<K>) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const [value, setValue] = useState<keyof K>(options[0] as keyof K);

  useImperativeHandle<HTMLDialogElement | null, HTMLDialogElement | null>(
    ref,
    () => modalRef.current,
    [],
  );

  return (
    <dialog className="true-dialog" ref={modalRef}>
      <Panel maxWidth="500px">
        <Panel.Header className="flex-row">
          <h5 className="flex-fill">Add Value</h5>
          <ActionOnlyButton className="core xs" onClick={() => modalRef.current?.close()}>
            <SVGIcons.Cross />
          </ActionOnlyButton>
        </Panel.Header>
        <Panel.Dropdown
          value={value as string}
          setValue={(x) => setValue(x as keyof K)}
          labelText="Select"
          options={options.map((x) => ({ value: x as string, text: x as string }))}
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
