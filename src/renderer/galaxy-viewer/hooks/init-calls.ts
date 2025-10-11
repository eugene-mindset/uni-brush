import { BASE_LAYER, BLOOM_LAYER, BLOOM_PARAMS, DEBUG_LAYER, OVERLAY_LAYER } from "@/config";
import { CompositionShader } from "@/renderer/three/shaders";
import * as THREE from "three";
import {
  EffectComposer,
  MapControls,
  RenderPass,
  ShaderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

interface initCoreData {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: MapControls;
  clock: THREE.Clock;
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
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
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
  controls.maxDistance = 2500;

  return { scene, camera, controls, clock: new THREE.Clock() };
}

export type RenderPassPipeline = Record<number, EffectComposer>;

interface initRenderData {
  renderer: THREE.WebGLRenderer;
  pipeline: RenderPassPipeline;
}

/**
 * Initializes renderer and passes to properly setup view
 * @param canvas canvas to create render pipeline for
 * @returns newly created rendering-related objects
 */
export function initRenderer(
  canvas: HTMLCanvasElement,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
): initRenderData {
  if (!canvas) throw new Error("Canvas element is not valid.");

  // renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    logarithmicDepthBuffer: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  const renderPass = new RenderPass(scene, camera);
  const bloomComposer = createBloomComposer({ renderer, renderPass });
  const overlayComposer = createOverlayComposer({ renderer, renderPass });

  // Shader pass to combine base layer, bloom, and overlay layers
  const finalPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
        overlayTexture: { value: overlayComposer.renderTarget2.texture },
      },
      vertexShader: CompositionShader.vertex,
      fragmentShader: CompositionShader.fragment,
      defines: {},
    }),
    "baseTexture"
  );
  finalPass.needsSwap = true;

  const baseComposer = createBaseComposer({ renderer, renderPass }, finalPass);

  const passes = {
    [BLOOM_LAYER]: bloomComposer,
    [OVERLAY_LAYER]: overlayComposer,
    [BASE_LAYER]: baseComposer,
  };

  return { renderer, pipeline: passes };
}

interface createComposerArgs {
  renderer: THREE.WebGLRenderer;
  renderPass: RenderPass;
}

function createBloomComposer(args: createComposerArgs) {
  const { renderer, renderPass } = args;

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = BLOOM_PARAMS.bloomThreshold;
  bloomPass.strength = BLOOM_PARAMS.bloomStrength;
  bloomPass.radius = BLOOM_PARAMS.bloomRadius;

  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderPass);
  bloomComposer.addPass(bloomPass);

  return bloomComposer;
}

function createOverlayComposer(args: createComposerArgs) {
  const { renderer, renderPass } = args;

  const overlayComposer = new EffectComposer(renderer);
  overlayComposer.renderToScreen = false;
  overlayComposer.addPass(renderPass);

  return overlayComposer;
}

function createBaseComposer(args: createComposerArgs, finalPass: ShaderPass) {
  const { renderer, renderPass } = args;

  const baseComposer = new EffectComposer(renderer);
  baseComposer.addPass(renderPass);
  baseComposer.addPass(finalPass);

  return baseComposer;
}

export function enablePipeline(camera: THREE.PerspectiveCamera, pipeline: RenderPassPipeline) {
  Object.entries(pipeline).forEach((value) => {
    const [layer, _] = value;
    camera.layers.enable(Number(layer));
  });
}

export function renderPipeline(pipeline: RenderPassPipeline) {
  Object.entries(pipeline).forEach((value) => {
    const [_, composer] = value;
    composer.render();
  });
}
