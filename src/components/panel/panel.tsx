import { toChildArray } from "preact";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import classNames from "classnames";

import { useDraggable } from "@/hooks";

import styles from "./panel.module.css";
import { PanelContext } from "./context";
import { PanelHeader } from "./panel-header";
import { PanelGroup } from "./panel-group";
import { PanelInput } from "./panel-input";
import { CommonProps } from "./types";
import { PanelVectorInput } from "./panel-vector-input";
import { ToggleButton } from "../buttons";
import { PanelSelectInput } from "./panel-select-input";

interface Props extends CommonProps {
  title?: string;
  canToggle?: boolean;
  canDrag?: boolean;
  width?: string | number | null;
  height?: string | number | null;
  maxWidth?: string | number | null;
  maxHeight?: string | number | null;
  position?: "absolute" | "relative";
  floatX?: "left" | "right";
  floatY?: "top" | "bottom";
}

// TODO: move out dragging logic into hook/component
export function Panel(props: Props) {
  const [toggle, setToggle] = useState<boolean>(true);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLElement | null>(null);

  const [panelDim, setPanelDim] = useState({ w: 0, h: 0 });
  const [parentDim, setParentDim] = useState({ w: 0, h: 0 });
  const initPosSet = useRef(false);

  useLayoutEffect(() => {
    if (!panelRef.current || !props.canDrag) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((element) => {
        if (element.target === panelRef.current) {
          setPanelDim({
            w: element.borderBoxSize[0].inlineSize,
            h: element.borderBoxSize[0].blockSize,
          });
        } else {
          setParentDim({
            w: element.borderBoxSize[0].inlineSize,
            h: element.borderBoxSize[0].blockSize,
          });
        }
      });
    });

    resizeObserver.observe(panelRef.current);
    if (panelRef.current.parentElement) resizeObserver.observe(panelRef.current.parentElement);

    return () => resizeObserver.disconnect();
  }, [props.canDrag]);

  useEffect(() => {
    if (
      !props.canDrag ||
      initPosSet.current ||
      !(panelDim.w && panelDim.h && parentDim.w && parentDim.h)
    )
      return;
    let floatX = 0;
    let floatY = 0;

    if (props.floatX === "right") {
      floatX = parentDim.w - panelDim.w;
    }

    if (props.floatY === "bottom") {
      floatY = parentDim.h - panelDim.h;
    }

    setPosition({ x: floatX, y: floatY });
    initPosSet.current = true;
  }, [panelDim, parentDim]);

  const {
    setPosition,
    onPointerDown: onDragStart,
    isDragging,
    transform: dragTransform,
  } = useDraggable({
    enabled: !!props.canDrag,
    isBounded: true,
    containerWidth: panelDim.w,
    containerHeight: panelDim.h,
    boundWidth: parentDim.w,
    boundHeight: parentDim.h,
  });

  return (
    <PanelContext.Provider value={{}}>
      <div
        ref={panelRef}
        style={{
          width: props.width,
          height: props.height,
          maxWidth: props.width,
          maxHeight: props.maxHeight,
          transform: (props.canDrag && dragTransform) || "",
          position: props?.position,
        }}
        className={classNames(
          props.className,
          styles.container,
          "core-div",
          props.canDrag && styles.draggable,
          props.canDrag && isDragging && styles.dragging
        )}
      >
        {props.title && (
          <div
            ref={(x) => {
              titleRef.current = x;
            }}
            className={classNames(styles.title, toggle && styles.title_toggle)}
            onPointerDown={onDragStart}
          >
            {props.canToggle && (
              <ToggleButton toggle={toggle} onToggle={() => setToggle((x) => !x)} />
            )}
            <h1 className={styles.title_text}>{props.title}</h1>
          </div>
        )}
        <div className="scrollable">{toggle && toChildArray(props?.children)}</div>
      </div>
    </PanelContext.Provider>
  );
}

Panel.Header = PanelHeader;
Panel.Group = PanelGroup;
Panel.Input = PanelInput;
Panel.Vector = PanelVectorInput;
Panel.Dropdown = PanelSelectInput;
