import { RefObject } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "three";
import Stats from "stats.js";

import { Entity } from "@/models";
import { createGalaxyScene } from "@/renderer/three/galaxy/create-galaxy-scene";
import { BaseVisual, StarSystemVisual } from "@/renderer/three";
import { useMainViewFullContext } from "@/store/main-view-context";
import { BaseGalaxyConfig } from "@/models/procedural-generators";
import { config, DEBUG_LAYER } from "@/config";
import {
  enablePipeline,
  initCore,
  initRenderer,
  RenderPassPipeline,
  renderPipeline,
} from "./init-calls";
import { MathHelpers } from "@/util";
import { MapControls } from "three/examples/jsm/Addons.js";
import { useSignalEffect } from "@preact/signals";

export interface RenderGalaxyData {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  initialize: () => void;
  cleanUp: () => void;
}

const CAMERA_LINEAR_SPEED = 200;
const CAMERA_ANGULAR_SPEED = 7.5;
const CAMERA_PHYSICS_PRECISION = 0.001;
const CAMERA_LERP = 0.55;

export interface RendererControls {
  // updateCamera: (position: THREE.Vector3, quaternion: THREE.Quaternion) => void;
}

// TODO: split this up between hook to control the renderer and hook to control scene
export const useRenderGalaxy = (
  canvasRef: RefObject<HTMLCanvasElement>
): [RenderGalaxyData, BaseGalaxyConfig, RendererControls] => {
  // base three objects
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<MapControls>();
  const clockRef = useRef<THREE.Clock>();

  const targetCameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // render stuff
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const pipelineRef = useRef<RenderPassPipeline>();
  const renderCallback = useCallback(() => {
    if (!pipelineRef.current) return;

    renderPipeline(pipelineRef.current);
  }, [pipelineRef.current]);

  // handle for animation loop
  const animateHandleRef = useRef<number>();

  // pointer info
  const pointerRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const raycastRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  raycastRef.current.layers.enableAll();
  raycastRef.current.layers.disable(DEBUG_LAYER);

  // stats
  const statsRef = useRef<Stats>(new Stats());
  statsRef.current.showPanel(0);

  // main
  const mainView = useMainViewFullContext();

  // intersect call
  const getIntersectedEntity = () => {
    if (!cameraRef.current || !sceneRef.current) return;

    raycastRef.current?.setFromCamera(pointerRef.current, cameraRef.current);
    const intersects = raycastRef.current.intersectObjects(sceneRef.current?.children);

    if (intersects.length == 0) return;

    const intersect = intersects[0];
    const userData = intersect.object.userData;

    if (!userData?.visualRef) return;

    const visual = userData?.visualRef as BaseVisual;

    return {
      entity: {
        refVisual: visual,
        refEntity: visual.entity,
        refType: visual.entity.type,
      },
      intersect,
    };
  };

  // animation loop
  const animate = () => {
    statsRef.current.begin();
    if (!clockRef.current) {
      renderCallback();
      animateHandleRef.current = requestAnimationFrame(animate);

      statsRef.current.end();
      return;
    }

    const delta = clockRef.current.getDelta();

    // const outIntersect = getIntersectedEntity();
    // if (outIntersect) {
    //   const { entity, intersect } = outIntersect;
    //   mainView.pointer.setIntersect("hover", entity, intersect);
    // } else {
    //   mainView.pointer.setIntersect("hover");
    // }

    // if (cameraRef.current) {
    //   const camera = cameraRef.current;
    //   Entity.StarSystem.Manager.updateVisualScale(camera.position);

    //   const target = targetCameraRef.current;

    //   if (target) {
    //     let linPrecise = false;
    //     let angPrecise = false;

    //     const translateV = new THREE.Vector3().subVectors(target.position, camera.position);
    //     const translateMag = translateV.length();

    //     if (translateMag < delta * CAMERA_LINEAR_SPEED) {
    //       linPrecise = true;
    //       camera.position.copy(target.position);
    //     } else {
    //       camera.position.lerp(
    //         camera.position.addScaledVector(translateV.normalize(), CAMERA_LINEAR_SPEED * delta),
    //         CAMERA_LERP
    //       );
    //     }

    //     const rotateQ = new THREE.Quaternion()
    //       .copy(camera.quaternion)
    //       .rotateTowards(target.quaternion, CAMERA_ANGULAR_SPEED * delta);

    //     if (rotateQ.angleTo(target.quaternion) < CAMERA_PHYSICS_PRECISION) {
    //       angPrecise = true;
    //       camera.setRotationFromQuaternion(target.quaternion);
    //     } else {
    //       const slerped = new THREE.Quaternion().copy(camera.quaternion).slerp(rotateQ, 0.25);
    //       camera.setRotationFromQuaternion(slerped);
    //     }

    //     if (linPrecise && angPrecise) {
    //       targetCameraRef.current = null;
    //     }
    //   }
    // }

    // if (sceneRef.current && cameraRef.current) {
    //   rendererRef.current?.render(sceneRef.current, cameraRef.current);
    // }

    renderCallback();

    statsRef.current.end();
    animateHandleRef.current = requestAnimationFrame(animate);
  };

  // initialize canvas
  const initialize = () => {
    console.log("init renderer");
    if (!canvasRef.current) return;
    const { scene, camera, controls, clock } = initCore(canvasRef.current);

    const { renderer, pipeline } = initRenderer(canvasRef.current, scene, camera);
    enablePipeline(camera, pipeline);

    // load 3d visuals into scene
    createGalaxyScene(scene, config);

    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;
    clockRef.current = clock;

    rendererRef.current = renderer;
    pipelineRef.current = pipeline;

    animate();
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

  const updateCameraToFocus = (position: THREE.Vector3, rotation?: THREE.Quaternion) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const targetCam = new THREE.PerspectiveCamera();
    targetCam.position.copy(cameraRef.current.position);
    targetCam.rotation.copy(cameraRef.current.rotation);

    const translateV = new THREE.Vector3().subVectors(position, cameraRef.current.position);

    targetCam.position.copy(position).sub(translateV.normalize().multiplyScalar(2.5));

    if (rotation) {
    } else {
      targetCam.lookAt(position);
    }

    targetCameraRef.current = targetCam;
  };

  // get selected object
  const onCanvasClick = () => {
    mainView.pointer.setIntersect("select");
  };

  useSignalEffect(() => {
    const target = mainView.pointer.select.ref.value?.refVisual?.object3D;
    if (!target) {
      controlsRef.current?.target.set(0, 0, 0);
      return;
    }

    updateCameraToFocus(target.position);
    controlsRef.current?.target.copy(target.position);
  });

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

  useEffect(() => {
    document.body.appendChild(statsRef.current.dom);
    statsRef.current.dom.style.display = "flex";
    statsRef.current.dom.style.right = "0";
    statsRef.current.dom.style.left = "auto";
  }, []);

  return [
    {
      scene: sceneRef.current,
      camera: cameraRef.current,
      renderer: rendererRef.current,
      cleanUp,
      initialize,
    },
    config,
    {},
  ];
};
