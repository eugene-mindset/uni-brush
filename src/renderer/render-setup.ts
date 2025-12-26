import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

import { BLOOM_PARAMS } from "./global";

export type RenderPasses = Record<number, EffectComposer>;

interface createComposerArgs {
  renderer: THREE.WebGLRenderer;
  renderPass: RenderPass;
  dimensions?: {
    width: number;
    height: number;
  };
}

// TODO: window -> div dimensions arg

export function createBloomComposer(args: createComposerArgs) {
  const { renderer, renderPass, dimensions } = args;

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(
      dimensions?.width || window.innerWidth,
      dimensions?.height || window.innerHeight,
    ),
    1.5,
    0.4,
    0.85,
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

export function createOverlayComposer(args: createComposerArgs) {
  const { renderer, renderPass } = args;

  const overlayComposer = new EffectComposer(renderer);
  overlayComposer.renderToScreen = false;
  overlayComposer.addPass(renderPass);

  return overlayComposer;
}

export function createBaseComposer(args: createComposerArgs, finalPass: ShaderPass) {
  const { renderer, renderPass } = args;

  const baseComposer = new EffectComposer(renderer);
  baseComposer.addPass(renderPass);
  baseComposer.addPass(finalPass);

  return baseComposer;
}

export function enablePipeline(camera: THREE.PerspectiveCamera, pipeline: RenderPasses) {
  Object.entries(pipeline).forEach((value) => {
    const [layer, _] = value;
    camera.layers.enable(Number(layer));
  });
}

export function renderPipeline(pipeline: RenderPasses) {
  Object.entries(pipeline).forEach((value) => {
    const [_, composer] = value;
    composer.render();
  });
}
