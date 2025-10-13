import { ComponentChildren, createContext, FunctionalComponent, toChildArray } from "preact";
import { useState } from "preact/hooks";
import classNames from "classnames";

import styles from "./panel.module.css";
import { SVGIcons } from "@/components";

interface PanelState {}
const PanelContext = createContext<PanelState>({});

interface Props {
  title?: string;
  canToggle?: boolean;
  children?: ComponentChildren;
  width?: string | number | null;
  height?: string | number | null;
  maxWidth?: string | number | null;
  maxHeight?: string | number | null;
  className?: string;
}

export function Panel(props: Props) {
  const [toggle, setToggle] = useState<boolean>(true);

  return (
    <PanelContext.Provider value={{}}>
      <div
        style={{
          width: props.width,
          height: props.height,
          maxWidth: props.width,
          maxHeight: props.maxHeight,
        }}
        className={classNames(props.className, styles.container, "core-div")}
      >
        <div className={classNames(styles.title, toggle && styles.title_toggle)}>
          {props.canToggle && (
            <button className="core square" onClick={() => setToggle((x) => !x)}>
              {toggle ? <SVGIcons.CaretUpFill /> : <SVGIcons.CaretDownFill />}
            </button>
          )}
          <h1 className={styles.title_text}>{props.title}</h1>
        </div>
        <div className="panel-body">{toggle && toChildArray(props?.children)}</div>
      </div>
    </PanelContext.Provider>
  );
}

interface HeaderProps {
  children?: ComponentChildren;
}

const PanelHeader: FunctionalComponent<HeaderProps> = (props) => {
  return <div className={styles.header}>{props?.children}</div>;
};

Panel.Header = PanelHeader;
