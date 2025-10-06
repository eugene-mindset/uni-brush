import { RefObject } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "three";

import { Entity } from "@/models";
import { createGalaxyScene } from "@/renderer/three/galaxy/create-galaxy-scene";
import { BaseVisual } from "@/renderer/three";
import { useMainViewFullContext } from "@/store/main-view-context";
import { BaseGalaxyConfig } from "@/models/procedural-generators";
import { config } from "@/config";
import {
  enablePipeline,
  initCore,
  initRenderer,
  RenderPassPipeline,
  renderPipeline,
} from "./init-calls";

export interface RenderGalaxyData {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  initialize: () => void;
  cleanUp: () => void;
}

export interface RenderIntersectData extends THREE.Intersection {
  refVisual?: BaseVisual;
  refEntity?: Entity.Base.EntityType;
  refType?: Entity.EntityTypes;
}

export const useRenderGalaxy = (
  canvasRef: RefObject<HTMLCanvasElement>
): [RenderGalaxyData, BaseGalaxyConfig] => {
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const pipelineRef = useRef<RenderPassPipeline>();
  const animateHandleRef = useRef<number>();

  const pointerRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const raycastRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const [_, selectObject] = useState<RenderIntersectData>();

  const mainView = useMainViewFullContext();

  // initialize canvas
  const initialize = () => {
    console.log("init");
    if (!canvasRef.current) return;
    const { scene, camera, controls } = initCore(canvasRef.current);

    const { renderer, pipeline } = initRenderer(canvasRef.current, scene, camera);
    enablePipeline(camera, pipeline);
    const renderCall = () => renderPipeline(pipeline);

    // load 3d visuals into scene
    createGalaxyScene(scene, config);

    // animation loop
    const animate = () => {
      Entity.StarSystem.Manager.updateVisualScale(camera.position);
      renderCall();
      animateHandleRef.current = requestAnimationFrame(animate);
    };

    animate();
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    pipelineRef.current = pipeline;
  };

  // cleanup function to call when cleaning up render
  const cleanUp = () => {
    // might not be the best approach long term for performance: https://discourse.threejs.org/t/renderer-render-method-makes-an-webgl-error-in-useeffect/40866/5
    animateHandleRef?.current && cancelAnimationFrame(animateHandleRef?.current);

    if (canvasRef.current && rendererRef.current) {
      rendererRef.current.dispose();
    }

    if (pipelineRef.current) {
      Object.entries(pipelineRef.current).forEach((x) => x[1].dispose());
    }

    Entity.StarSystem.Manager.disposeVisuals();
  };

  // callback to resize
  const onWindowResize = () => {
    if (cameraRef.current) {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current?.setSize(window.innerWidth, window.innerHeight);
    }
  };

  // find pointer within canvas
  const onCanvasPointerMove = (event: PointerEvent) => {
    pointerRef.current.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  };

  // get selected object
  const onCanvasClick = () => {
    if (!cameraRef.current || !sceneRef.current) return;

    raycastRef.current?.setFromCamera(pointerRef.current, cameraRef.current);
    const intersects = raycastRef.current.intersectObjects(sceneRef.current?.children);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const userData = intersect.object.userData;

      if (!userData?.id) return;

      selectObject(() => {
        const entity = Entity.StarSystem.Manager.get(userData?.id);
        mainView.pointer.intersect.setIntersect(entity);

        return {
          ...intersect,
          refVisual: userData?.ref,
          // TODO: make a method to retrieve correct entity
          refEntity: entity,
          refType: Entity.EntityTypes.STAR_SYSTEM,
        };
      });
    } else {
      mainView.pointer.intersect.setIntersect();
      selectObject(undefined);
    }
  };

  // effect to update dimensions in render if canvas is resized
  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    canvasRef.current?.addEventListener("pointermove", onCanvasPointerMove);
    canvasRef.current?.addEventListener("click", onCanvasClick);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      canvasRef.current?.removeEventListener("pointermove", onCanvasPointerMove);
      canvasRef.current?.removeEventListener("click", onCanvasClick);
    };
  }, [canvasRef.current]);

  return [
    {
      scene: sceneRef.current,
      camera: cameraRef.current,
      renderer: rendererRef.current,
      cleanUp,
      initialize,
    },
    config,
  ];
};
