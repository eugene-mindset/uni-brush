import classNames from "classnames";
import { createStore, Provider } from "jotai";
import { getDefaultStore } from "jotai";
import { Store } from "jotai/vanilla/store";
import { Ref, useCallback, useEffect, useRef } from "react";

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
  onInitialize?: (pipeline: RenderPipeline) => void;
  onCleanUp?: (pipeline: RenderPipeline) => void;
  onTick?: (pipeline: RenderPipeline, delta: number) => void;
}

const InnerThreeJSViewer = ({ children, ...props }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pipelineAtom = renderPipelineAtomFamily(props?.id || "");
  const pipelineRef = useRef<RenderPipeline>(null);

  const observerRef = useRef<ResizeObserver>(null);

  const finalOnInit = useCallback(
    (pipeline: RenderPipeline) => {
      props.onInitialize && props.onInitialize(pipeline);
    },
    [props],
  );

  const finalOnCleanUp = useCallback(
    (pipeline: RenderPipeline) => {
      props.onCleanUp && props.onCleanUp(pipeline);
    },
    [props],
  );

  const finalOnTick = useCallback(
    (pipeline: RenderPipeline, delta: number) => {
      props.onTick && props.onTick(pipeline, delta);
    },
    [props],
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!divRef.current) return;

    const pipeline = new RenderPipeline(canvasRef.current);
    pipelineRef.current = pipeline;
    pipeline.updateDimensions(divRef.current.clientWidth, divRef.current.clientHeight);
    pipeline.setCustomInitialize(() => finalOnInit(pipeline));
    pipeline.setCustomCleanUp(() => finalOnCleanUp(pipeline));
    pipeline.setCustomTick((delta) => finalOnTick(pipeline, delta));
    pipeline.initialize();

    if (props.id) {
      getDefaultStore().set(pipelineAtom, pipeline);
    }

    return () => {
      if (props.id) {
        getDefaultStore().set(pipelineAtom, null);
      }
      pipelineRef.current?.cleanUp();
      pipelineRef.current = null;
    };
  }, [divRef, canvasRef, props, finalOnInit, finalOnCleanUp, finalOnTick, pipelineAtom]);

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

  // find pointer within canvas
  const onCanvasPointerMove = (event: PointerEvent): void => {
    if (!canvasRef.current) return;

    pipelineRef.current?.pointer?.set(
      (event.clientX / canvasRef.current.width) * 2 - 1,
      -(event.clientY / canvasRef.current.height) * 2 + 1,
    );
  };

  const onCanvasPointerClick = (_event): void => {
    pipelineRef.current?.selectFromPointer();
  };

  // effect to update dimensions in render if canvas is resized
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("pointermove", onCanvasPointerMove);
    canvas?.addEventListener("click", onCanvasPointerClick);

    return () => {
      canvas.removeEventListener("pointermove", onCanvasPointerMove);
      canvas?.removeEventListener("click", onCanvasPointerClick);
    };
  }, []);

  useEffect(() => {
    const viewer = pipelineRef.current;
    if (!viewer?.stats) return;

    divRef.current?.appendChild(viewer.stats.dom);
    viewer.stats.dom.style.display = "flex";
    viewer.stats.dom.style.right = "0";
    viewer.stats.dom.style.left = "auto";
  });

  return (
    <div ref={divRef} id={props.id} className={props.className}>
      <canvas ref={canvasRef} className={classNames(styles.viewerInner)} />
      {children}
    </div>
  );
};

export const ThreeJSViewer = (props: Props) => {
  const storeRef = useRef(props?.store || createStore());

  return (
    <Provider store={storeRef.current}>
      <InnerThreeJSViewer {...props} store={storeRef.current} />
    </Provider>
  );
};
