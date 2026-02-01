import classNames from "classnames";
import { createStore, Provider } from "jotai";
import { getDefaultStore } from "jotai";
import { Store } from "jotai/vanilla/store";
import { Ref, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

import { RenderPipeline } from "@/renderer";
import { renderPipelineAtomFamily } from "@/store";

import styles from "./style.module.css";
import { ThreeJSViewerRef } from "./type";

export interface Props extends React.PropsWithChildren {
  id?: string;
  ref?: Ref<ThreeJSViewerRef>;
  className?: string;
  store?: Store;
  isMain?: boolean;
  onSelect?: (pipeline: RenderPipeline) => void;
  onInitialize?: (pipeline: RenderPipeline) => void;
  onCleanUp?: (pipeline: RenderPipeline) => void;
  onTick?: (pipeline: RenderPipeline, delta: number) => void;
  onCameraTargetReached?: (pipeline: RenderPipeline) => void;
}

const InnerThreeJSViewer = ({ ref, children, id, ...props }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pipelineAtom = renderPipelineAtomFamily(id || "");
  const pipelineRef = useRef<RenderPipeline>(null);

  const observerRef = useRef<ResizeObserver>(null);
  const isDragThreshold = useRef<number>(null);

  // Store callbacks in refs so they can update without recreating the pipeline
  const onInitializeRef = useRef(props.onInitialize);
  const onCleanUpRef = useRef(props.onCleanUp);
  const onTickRef = useRef(props.onTick);
  const onSelectRef = useRef(props.onSelect);
  const onCameraTargetReachedRef = useRef(props.onCameraTargetReached);

  useLayoutEffect(() => {
    onInitializeRef.current = props.onInitialize;
    onCleanUpRef.current = props.onCleanUp;
    onTickRef.current = props.onTick;
    onSelectRef.current = props.onSelect;
    onCameraTargetReachedRef.current = props.onCameraTargetReached;
  });

  useImperativeHandle(ref, () => {
    return {
      pipeline: pipelineRef.current,
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!divRef.current) return;

    const pipeline = new RenderPipeline(canvasRef.current);
    pipelineRef.current = pipeline;
    pipeline.updateDimensions(divRef.current.clientWidth, divRef.current.clientHeight);
    pipeline.setCustomInitialize(() => onInitializeRef.current?.(pipeline));
    pipeline.setCustomCleanUp(() => onCleanUpRef.current?.(pipeline));
    pipeline.setCustomTick((delta) => onTickRef.current?.(pipeline, delta));
    pipeline.initialize();

    if (id) {
      getDefaultStore().set(pipelineAtom, pipeline);
    }

    return () => {
      if (id) {
        getDefaultStore().set(pipelineAtom, null);
      }
      pipelineRef.current?.cleanUp();
      pipelineRef.current = null;
    };
  }, [id, pipelineAtom]);

  useEffect(() => {
    const pipeline = pipelineRef.current;
    if (!pipeline) return;

    const finalOnSelect = () => onSelectRef.current?.(pipeline);
    const finalOnCameraTargetReached = () => onCameraTargetReachedRef.current?.(pipeline);

    pipeline.addEventListener("on_click", finalOnSelect);
    pipeline.addEventListener("on_camera_target_reached", finalOnCameraTargetReached);

    return () => {
      pipeline.removeEventListener("on_click", finalOnSelect);
      pipeline.removeEventListener("on_camera_target_reached", finalOnCameraTargetReached);
    };
  }, []);

  useEffect(() => {
    const mainDiv = divRef.current;
    if (!mainDiv) return;

    observerRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        pipelineRef.current?.updateDimensions(entry.contentRect.width, entry.contentRect.height);
      }
    });

    observerRef.current.observe(mainDiv);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [canvasRef]);

  useEffect(() => {
    const viewer = pipelineRef.current;
    if (!viewer?.stats) return;

    divRef.current?.appendChild(viewer.stats.dom);
    viewer.stats.dom.style.display = "flex";
    viewer.stats.dom.style.right = "0";
    viewer.stats.dom.style.left = "auto";

    return () => {
      viewer.stats.dom.remove();
    };
  });

  const onCanvasPointerDown = (_event: React.PointerEvent<HTMLCanvasElement>): void => {
    isDragThreshold.current = 0;
  };

  const onCanvasPointerMove = (event: React.PointerEvent<HTMLCanvasElement>): void => {
    if (!canvasRef.current) return;

    pipelineRef.current?.pointer?.set(
      (event.clientX / canvasRef.current.width) * 2 - 1,
      -(event.clientY / canvasRef.current.height) * 2 + 1,
    );

    if (isDragThreshold.current) {
      isDragThreshold.current += 1;
    }
  };

  const onCanvasPointerClick = (_event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!canvasRef.current) return;
    if (!pipelineRef.current) return;

    if (!isDragThreshold.current || isDragThreshold.current < 20) {
      pipelineRef.current?.selectFromPointer();
    }
    isDragThreshold.current = 0;
  };

  return (
    <div ref={divRef} id={id} className={props.className}>
      <canvas
        ref={canvasRef}
        id={`canvas-${id}`}
        className={classNames(styles.viewerInner)}
        onPointerMove={onCanvasPointerMove}
        onPointerDown={onCanvasPointerDown}
        onClick={onCanvasPointerClick}
      />
      {children}
    </div>
  );
};

export const ThreeJSViewer = (props: Props) => {
  const [store] = useState(createStore());

  return (
    <Provider store={store}>
      <InnerThreeJSViewer {...props} store={store} />
    </Provider>
  );
};
