import { RefObject } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/Addons.js";

import { Entity } from "@/models";
import { createGalaxyScene } from "@/renderer/threejs/galaxy/create-galaxy-scene";
import { BaseVisual } from "@/renderer/threejs";
import { useMainViewFullContext } from "@/store/main-view-context";
import { BaseGalaxyConfig } from "@/models/procedural-generators";
import { config } from "./config";

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

  const pointerRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const [_, selectObject] = useState<RenderIntersectData>();

  const [stars, setStars] = useState([]);

  const mainView = useMainViewFullContext();

  const onWindowResize = () => {
    if (cameraRef.current) {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current?.setSize(window.innerWidth, window.innerHeight);
    }
  };

  const onCanvasPointerMove = (event: PointerEvent) => {
    pointerRef.current.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  };

  const onCanvasClick = () => {
    // if (!cameraRef.current || !sceneRef.current) return;
    // raycasterRef.current?.setFromCamera(pointerRef.current, cameraRef.current);
    // const intersects = raycasterRef.current.intersectObjects(sceneRef.current?.children);
    // if (intersects.length > 0) {
    //   const intersect = intersects[0];
    //   const userData = intersect.object.userData;
    //   if (!userData?.id) return;
    //   selectObject(() => {
    //     const entity = Entity.StarSystem.Manager.get(userData?.id);
    //     mainView.pointer.intersect.setIntersect(entity);
    //     return {
    //       ...intersect,
    //       refVisual: userData?.ref,
    //       // TODO: make a method to retrieve correct entity
    //       refEntity: entity,
    //       refType: Entity.EntityTypes.STAR_SYSTEM,
    //     };
    //   });
    // } else {
    //   mainView.pointer.intersect.setIntersect();
    //   selectObject(undefined);
    // }
  };

  const initialize = () => {
    if (!canvasRef.current) return;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // const grid = new THREE.GridHelper(1000, 100);
    // scene.add(grid);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // const loader = new THREE.TextureLoader();
    // const texture = loader.load("src/assets/skybox.png", () => {
    //   texture.mapping = THREE.EquirectangularReflectionMapping;
    //   texture.colorSpace = THREE.SRGBColorSpace;
    //   scene.background = texture;
    // });

    // const camera = new THREE.OrthographicCamera();
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // controls
    // TODO: make my own control
    const controls = new MapControls(camera, renderer.domElement);

    // controls.addEventListener("change", renderer); // call this only in static scenes (i.e., if there is no animation loop)
    controls.keys = {
      LEFT: "ArrowLeft", //left arrow
      UP: "ArrowUp", // up arrow
      RIGHT: "ArrowRight", // right arrow
      BOTTOM: "ArrowDown", // down arrow
    };

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 10;
    controls.maxDistance = 300;

    // controls.maxPolarAngle = Math.PI / 2;
    // controls.minPolarAngle = -Math.PI / 2;
    // Load objects here
    createGalaxyScene(scene, config);

    camera.position.copy(new THREE.Vector3(0, 300, 0));
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
  };

  // Cleanup function
  const cleanUp = () => {
    if (canvasRef.current && rendererRef.current) {
      rendererRef.current.dispose();
    }

    // if (sceneRef) {
    //   Entity.StarSystem.Manager.mapEntities((x) => x.visual?.dispose());
    // }
  };

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
