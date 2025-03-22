import { RefObject } from "preact";
import { useRef } from "preact/hooks";
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/Addons.js";

import { Data } from "@/models";

import { createGalaxyScene } from "./create-galaxy-scene";

export interface MountGalaxyRendererData {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  initialize: () => void;
  cleanUp: () => void;
}

export const useRenderGalaxy = (mountRef: RefObject<HTMLDivElement>): MountGalaxyRendererData => {
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  const initialize = () => {
    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const loader = new THREE.TextureLoader();
    const texture = loader.load("src/assets/skybox.png", () => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
    });

    // const camera = new THREE.OrthographicCamera();
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    // controls
    // TODO: make my own control
    const controls = new MapControls(camera, renderer.domElement);

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 10;
    controls.maxDistance = 300;

    controls.maxPolarAngle = Math.PI / 2;

    // Load objects here
    createGalaxyScene(scene);

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
    if (mountRef.current && rendererRef.current) {
      rendererRef.current.dispose();
      mountRef.current?.removeChild(rendererRef.current.domElement);
    }

    if (sceneRef) {
      Data.StarSystem.Manager.mapEntities((x) => x.visual?.dispose());
    }
  };

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    cleanUp,
    initialize,
  };
};
