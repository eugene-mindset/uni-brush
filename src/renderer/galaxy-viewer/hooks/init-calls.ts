import * as THREE from "three";
import { MapControls } from "three/examples/jsm/Addons.js";

interface initCoreData {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: THREE.Controls<{}>;
}

/**
 * Initializes a canvas with objects needed to enable viewing.
 * @param canvas to initialize core three.js objects for
 * @returns objects created
 */
export function initCore(canvas: HTMLCanvasElement): initCoreData {
  if (!canvas) throw new Error("Canvas element is not valid.");

  // scene
  const scene = new THREE.Scene();

  // camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
  camera.position.copy(new THREE.Vector3(0, 300, 0));
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // controls
  const controls = new MapControls(camera, canvas);

  // controls.addEventListener("change", renderer); // call this only in static scenes (i.e., if there is no animation loop)
  controls.keys = {
    LEFT: "ArrowLeft", //left arrow
    UP: "ArrowUp", // up arrow
    RIGHT: "ArrowRight", // right arrow
    BOTTOM: "ArrowDown", // down arrow
  };

  // controls.maxPolarAngle = Math.PI / 2;
  // controls.minPolarAngle = -Math.PI / 2;

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 1;
  controls.maxDistance = 1000;

  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  return { scene, camera, controls };
}

interface initRenderData {
  renderer: THREE.WebGLRenderer;
}

/**
 * Initializes renderer and passes to properly setup view
 * @param canvas canvas to create render pipeline for
 * @returns newly created rendering-related objects
 */
export function initRenderer(canvas: HTMLCanvasElement): initRenderData {
  if (!canvas) throw new Error("Canvas element is not valid.");

  // renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    logarithmicDepthBuffer: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  // TODO: add render passes, let them be configurable
  // TODO: add pipeline config call or something to properly order the passes

  return { renderer };
}
