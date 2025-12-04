import { RefObject, useCallback, useEffect, useRef } from "react";
import Stats from "stats.js";
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/Addons.js";

import { config } from "@/config";
import { Procedural } from "@/models";
import { createGalaxyScene, BaseVisual, RenderSetup } from "@/renderer";
import { useMainViewFullContext } from "@/context";
import { ThreeHelpers } from "@/util";
import { useAtomValue } from "jotai";
import { useStarSystemManager } from "./use-manager";

export interface RenderGalaxyData {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  initialize: () => void;
  cleanUp: () => void;
}

const CAMERA_LINEAR_SPEED = 400;
const CAMERA_ANGULAR_SPEED = 5;
// const CAMERA_PHYSICS_PRECISION = 0.001;
const CAMERA_LERP = 0.55;

export interface RendererControls {
  // updateCamera: (position: THREE.Vector3, quaternion: THREE.Quaternion) => void;
}

// TODO: split this up between hook to control the renderer and hook to control scene
export const useRenderGalaxy = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
): [RenderGalaxyData, Procedural.BaseGalaxyConfig, RendererControls] => {
  const starSystemManager = useStarSystemManager();

  // base three objects
  const sceneRef = useRef<THREE.Scene>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<MapControls>(null);
  const clockRef = useRef<THREE.Clock>(null);

  const targetCameraRef = useRef<THREE.PerspectiveCamera>(null);

  // render stuff
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const pipelineRef = useRef<RenderSetup.RenderPassPipeline>(null);
  const renderCallback = useCallback(() => {
    if (!pipelineRef.current) return;

    RenderSetup.renderPipeline(pipelineRef.current);
  }, []);

  // handle for animation loop
  const animateHandleRef = useRef<number>(null);

  // pointer info
  const pointerRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const raycastRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  raycastRef.current.layers.disable(31);

  // stats
  const statsRef = useRef<Stats>(new Stats());
  statsRef.current.showPanel(0);

  // main
  const mainView = useMainViewFullContext();
  const selectRef = useAtomValue(mainView.pointer.select.ref);

  // intersect call
  const getIntersectedEntity = () => {
    if (!cameraRef.current || !sceneRef.current) return;

    raycastRef.current?.setFromCamera(pointerRef.current, cameraRef.current);
    const intersects = raycastRef.current.intersectObjects(sceneRef.current?.children);

    if (intersects.length === 0) return;

    const intersect = intersects[0];
    const userData = ThreeHelpers.findAncestor(
      intersect.object,
      (anc) => !!anc.userData?.visualRef,
    )?.userData;

    if (!userData) return;

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

    const outIntersect = getIntersectedEntity();
    if (outIntersect) {
      const { entity, intersect } = outIntersect;
      mainView.pointer.setPointer("hover", entity, intersect);
    } else {
      mainView.pointer.setPointer("hover");
    }

    if (cameraRef.current) {
      const camera = cameraRef.current;
      starSystemManager.updateVisualScale(camera.position);

      const target = targetCameraRef.current;

      if (target) {
        let linPrecise = false;
        let angPrecise = false;

        const translateV = new THREE.Vector3().subVectors(target.position, camera.position);
        const translateMag = translateV.length();

        if (translateMag < delta * CAMERA_LINEAR_SPEED) {
          linPrecise = true;
          camera.position.copy(target.position);
        } else {
          camera.position.lerp(
            camera.position.addScaledVector(translateV.normalize(), CAMERA_LINEAR_SPEED * delta),
            CAMERA_LERP,
          );
        }

        const rotateQ = new THREE.Quaternion()
          .copy(camera.quaternion)
          .rotateTowards(target.quaternion, CAMERA_ANGULAR_SPEED * delta);
        const rotateDeltaMag = camera.quaternion.angleTo(target.quaternion);

        if (rotateDeltaMag < delta * CAMERA_ANGULAR_SPEED) {
          angPrecise = true;
          camera.setRotationFromQuaternion(target.quaternion);
        } else {
          const slerpRot = new THREE.Quaternion()
            .copy(camera.quaternion)
            .slerp(rotateQ, CAMERA_LERP);
          camera.setRotationFromQuaternion(slerpRot);
        }

        if (linPrecise && angPrecise) {
          targetCameraRef.current = null;
        }
      }
    }
    renderCallback();
    statsRef.current.end();
    animateHandleRef.current = requestAnimationFrame(animate);
  };

  // initialize canvas
  const initialize = () => {
    if (!canvasRef.current) return;
    const { scene, camera, controls, clock } = RenderSetup.initCore(canvasRef.current);

    const { renderer, pipeline } = RenderSetup.initRenderer(canvasRef.current, scene, camera);
    RenderSetup.enablePipeline(camera, pipeline);

    // load 3d visuals into scene
    createGalaxyScene(starSystemManager.getAll(), scene, config);

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

    starSystemManager.disposeVisuals();
  };

  const updateCameraToFocus = (position: THREE.Vector3, rotation?: THREE.Quaternion) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const targetCam = new THREE.PerspectiveCamera();
    targetCam.position.copy(cameraRef.current.position);
    targetCam.rotation.copy(cameraRef.current.rotation);

    const translateV = new THREE.Vector3().subVectors(position, cameraRef.current.position);

    targetCam.position.copy(position).sub(translateV.normalize().multiplyScalar(2.5));

    if (rotation) {
      // TODO: figure out what was missing here...
    } else {
      targetCam.lookAt(position);
    }

    targetCameraRef.current = targetCam;
  };

  // get selected object
  const onCanvasClick = (): void => {
    mainView.pointer.setPointer("select");
  };

  useEffect(() => {
    const targetRef = selectRef?.refVisual?.object3D;
    if (!targetRef) {
      targetCameraRef.current = null;
      controlsRef.current?.target.set(0, 0, 0);
      return;
    }

    updateCameraToFocus(targetRef.position);
    controlsRef.current?.target.copy(targetRef.position);
  }, []);

  // callback to resize
  const onWindowResize = () => {
    if (cameraRef.current) {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current?.setSize(window.innerWidth, window.innerHeight);
    }
  };

  // find pointer within canvas
  const onCanvasPointerMove = (event: PointerEvent): void => {
    pointerRef.current.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    );
  };

  // effect to update dimensions in render if canvas is resized
  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    const canvas = canvasRef.current;
    canvas?.addEventListener("pointermove", onCanvasPointerMove);
    canvas?.addEventListener("click", onCanvasClick);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      canvas?.removeEventListener("pointermove", onCanvasPointerMove);
      canvas?.removeEventListener("click", onCanvasClick);
    };
  }, [canvasRef, onCanvasClick]);

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
