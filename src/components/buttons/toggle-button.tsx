import { SVGIcons } from "@/components";

import { ActionOnlyButton } from "./action-only-button";

interface Props {
  toggle: boolean;
  onToggle: () => void;
  className?: string;
}

export const ToggleButton: React.FC<Props> = (props: Props) => {
  const onClick = () => {
    props.onToggle();
  };

  return (
    <ActionOnlyButton onClick={onClick} className={props?.className}>
      {props.toggle ? <SVGIcons.CaretUpFill /> : <SVGIcons.CaretDownFill />}
    </ActionOnlyButton>
  );
};
