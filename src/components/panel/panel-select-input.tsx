import styles from "./style.module.css";
import classNames from "classnames";

interface Props {
  labelText?: string;
  value?: string | number;
  options: { value: string | number; text?: string }[];
  setValue?: (val?: string | number) => void;
}

export const PanelSelectInput: React.FC<Props> = (props: Props) => {
  const { value, options } = props;

  const onSelect = (value?: string | number) => {
    props.setValue && props.setValue(value);
  };

  return (
    <div className={classNames(styles.input, "gap", "fit-in-container")}>
      {props?.labelText && <label>{props.labelText}</label>}
      <select value={value} onInput={(event) => onSelect(event.currentTarget.value)}>
        {options.map((x) => (
          <option key={x.text} value={x.value}>
            {x.text}
          </option>
        ))}
      </select>
    </div>
  );
};
