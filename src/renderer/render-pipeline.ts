import Stats from "stats.js";
import * as THREE from "three";
import { MapControls, RenderPass, ShaderPass } from "three/examples/jsm/Addons.js";

import { CompositionShader } from "@/renderer/shaders";
import { EventManager } from "@/util";

import { Global, RenderSetup } from ".";
import { RenderPipelineIntersection } from "./render-pipeline-intersection";
import { RenderPasses } from "./render-setup";

const CAMERA_LINEAR_SPEED = 100;
const CAMERA_ANGULAR_SPEED = 2.5;
// const CAMERA_PHYSICS_PRECISION = 0.001;
const CAMERA_LERP = 0.25;

interface RenderPipelineEventsList {
  on_click: () => void;
  on_camera_target_reached: () => void;
}

export class RenderPipeline {
  public scene: THREE.Scene;

  public currentCamera: THREE.PerspectiveCamera;
  public targetCamera: THREE.PerspectiveCamera | null = null;
  private _helper: THREE.CameraHelper | null = null;

  public controls: MapControls;
  private _autoRotateTimeoutId: NodeJS.Timeout | null = null;

  public clock: THREE.Clock;

  public renderer: THREE.WebGLRenderer;
  public passes: RenderPasses;

  public pointer: THREE.Vector2;
  public raycast: THREE.Raycaster;
  private _hovered: RenderPipelineIntersection | null = null;
  private _selected: RenderPipelineIntersection | null = null;

  public stats: Stats;

  private _isInit = false;

  private _canvas: HTMLCanvasElement | null = null;

  private _customInit: (() => void) | null = null;
  private _customCleanUp: (() => void) | null = null;
  private _customTick: ((delta: number) => void) | null = null;

  public dim: THREE.Vector2;

  private _eventManager: EventManager<RenderPipelineEventsList>;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this.scene = new THREE.Scene();
    this.dim = new THREE.Vector2(window.innerWidth, window.innerHeight);

    // camera
    this.currentCamera = new THREE.PerspectiveCamera(75, this.dim.x / this.dim.y, 0.1, 5000);
    this.currentCamera.layers.enableAll();
    this.currentCamera.position.copy(new THREE.Vector3(0, 300, 0));
    this.currentCamera.lookAt(new THREE.Vector3(0, 0, 0));

    // controls
    this.controls = new MapControls(this.currentCamera, this._canvas);

    // controls.addEventListener("change", renderer); // call this only in static scenes (i.e., if there is no animation loop)
    this.controls.keys = {
      LEFT: "ArrowLeft", //left arrow
      UP: "ArrowUp", // up arrow
      RIGHT: "ArrowRight", // right arrow
      BOTTOM: "ArrowDown", // down arrow
    };

    // controls.maxPolarAngle = Math.PI / 2;
    // controls.minPolarAngle = -Math.PI / 2;
    this.controls.zoomToCursor = true;
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 2500;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.1;

    this.controls.addEventListener("start", () => {
      if (this._autoRotateTimeoutId != null) {
        clearTimeout(this._autoRotateTimeoutId);
        this._autoRotateTimeoutId = null;
      }

      this.controls.autoRotate = false;

      this._autoRotateTimeoutId = setTimeout(() => {
        this.controls.autoRotate = true;
      }, 5000);
    });

    // clock
    this.clock = new THREE.Clock();

    // renderer
    this.renderer = this.createRenderer();

    this.passes = this.createPipeline();

    // utility
    this.pointer = new THREE.Vector2();
    this.raycast = new THREE.Raycaster();
    this.stats = new Stats();

    this._eventManager = new EventManager();
  }

  private createRenderer() {
    if (!this._canvas) throw new Error("Canvas is not defined");
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this._canvas,
      logarithmicDepthBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    // renderer.setClearColor(0xffffff, 1);

    return renderer;
  }

  private createPipeline() {
    const canvas = this._canvas;
    if (!canvas) throw new Error("Canvas is not defined");

    const renderPass = new RenderPass(this.scene, this.currentCamera);
    const bloomComposer = RenderSetup.createBloomComposer({
      renderer: this.renderer,
      renderPass: renderPass,
      dimensions: {
        width: this.dim.x,
        height: this.dim.y,
      },
    });
    const overlayComposer = RenderSetup.createOverlayComposer({
      renderer: this.renderer,
      renderPass: renderPass,
    });

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
      "baseTexture",
    );
    finalPass.needsSwap = true;

    const baseComposer = RenderSetup.createBaseComposer(
      { renderer: this.renderer, renderPass },
      finalPass,
    );

    return {
      [Global.Layers.BLOOM_LAYER]: bloomComposer,
      [Global.Layers.OVERLAY_LAYER]: overlayComposer,
      [Global.Layers.BASE_LAYER]: baseComposer,
    };
  }

  // EVENTS

  public addEventListener<Key extends keyof RenderPipelineEventsList>(
    eventName: Key,
    callback: RenderPipelineEventsList[Key],
  ): void {
    this._eventManager.addEventListener(eventName, callback);
  }

  public removeEventListener<Key extends keyof RenderPipelineEventsList>(
    eventName: Key,
    callback: RenderPipelineEventsList[Key],
  ): void {
    this._eventManager.removeEventListener(eventName, callback);
  }

  protected emit<Key extends keyof RenderPipelineEventsList>(
    eventName: Key,
    ...args: unknown[]
  ): void {
    this._eventManager.emit(eventName, ...args);
  }

  public get isInitialized(): boolean {
    return this._isInit;
  }

  public initialize() {
    if (this._isInit) throw new Error("Cannot initialize already init render model");
    if (!this._canvas) throw new Error("Canvas element is not valid.");

    this.renderer = this.createRenderer();
    this.passes = this.createPipeline();
    RenderSetup.enablePipeline(this.currentCamera, this.passes);
    if (this._customInit) this._customInit();
    this._isInit = true;

    this.startRendering();
  }

  public updateDimensions(width: number, height: number) {
    if (this._isInit) {
      this.stopRendering();
      this.dim = new THREE.Vector2(width, height);
      this.createPipeline();
      this.startRendering();
    } else {
      this.dim = new THREE.Vector2(width, height);
      this.createPipeline();
    }
    // this.pipeline = this.createPipeline(width, height);
    // RenderSetup.enablePipeline(this.currentCamera, this.pipeline);
  }

  private startRendering() {
    this.renderer.setAnimationLoop(() => this.renderLoop());
  }

  public stopRendering() {
    this.renderer.setAnimationLoop(null);
  }

  public cleanUp() {
    this.stopRendering();
    this.renderer.dispose();
    Object.entries(this.passes).forEach((x) => x[1].dispose());
    if (this._customCleanUp) this._customCleanUp();

    this._isInit = false;
  }

  public getIntersectedEntity(): RenderPipelineIntersection | null {
    this.raycast.setFromCamera(this.pointer, this.currentCamera);
    const intersects = this.raycast.intersectObjects(this.scene.children);

    if (intersects.length === 0) return null;

    const intersect = intersects[0];

    return new RenderPipelineIntersection(intersect);
  }

  private renderLoop() {
    const delta = this.clock.getDelta();

    this.preTick(delta);
    this.tick(delta);
    this.postTick(delta);
  }

  private preTick(_delta: number) {
    this.stats.update();
    if (!this.targetCamera) {
      this.controls.update();
    }

    this._hovered = this.getIntersectedEntity();
  }

  private tick(delta: number) {
    if (this._customTick) this._customTick(delta);
  }

  private postTick(delta: number) {
    this.updateCamera(delta);
    RenderSetup.renderPipeline(this.passes);
  }

  public setCustomInitialize(step: () => void) {
    this._customInit = step;
  }

  public setCustomCleanUp(step: () => void) {
    this._customCleanUp = step;
  }

  public setCustomTick(step: (delta: number) => void) {
    this._customTick = step;
  }

  private updateCamera(delta: number) {
    this.currentCamera.aspect = this.dim.x / this.dim.y;
    this.currentCamera.updateProjectionMatrix();
    this.renderer.setSize(this.dim.x, this.dim.y);

    // this.pipeline = this.createPipeline(width, height);
    // RenderSetup.enablePipeline(this.currentCamera, this.pipeline);

    this.updateCameraFromTarget(delta);
  }

  private updateCameraFromTarget(delta: number) {
    if (this.targetCamera) {
      this.controls.enabled = false;
      this._helper?.update();

      let linPrecise = false;
      let angPrecise = false;

      const translateV = new THREE.Vector3().subVectors(
        this.targetCamera.position,
        this.currentCamera.position,
      );
      const translateMag = translateV.length();

      if (translateMag < delta * CAMERA_LINEAR_SPEED) {
        linPrecise = true;
        this.currentCamera.position.copy(this.targetCamera.position);
      } else {
        this.currentCamera.position.lerp(
          this.currentCamera.position.addScaledVector(
            translateV.normalize(),
            CAMERA_LINEAR_SPEED * delta,
          ),
          CAMERA_LERP,
        );
      }

      const rotateQ = new THREE.Quaternion()
        .copy(this.currentCamera.quaternion)
        .rotateTowards(this.targetCamera.quaternion, CAMERA_ANGULAR_SPEED * delta);
      const rotateDeltaMag = this.currentCamera.quaternion.angleTo(this.targetCamera.quaternion);

      if (rotateDeltaMag < delta * CAMERA_ANGULAR_SPEED) {
        angPrecise = true;
        this.currentCamera.setRotationFromQuaternion(this.targetCamera.quaternion);
      } else {
        const slerpRot = new THREE.Quaternion()
          .copy(this.currentCamera.quaternion)
          .slerp(rotateQ, CAMERA_LERP);
        this.currentCamera.setRotationFromQuaternion(slerpRot);
      }

      if (linPrecise && angPrecise) {
        this.clearTargetCamera();
        this.emit("on_camera_target_reached");
      }
    }
  }

  public clearTargetCamera() {
    this.targetCamera = null;
    this._helper && this.scene.remove(this._helper);
    this._helper?.dispose();
    this._helper = null;
    this.controls.enabled = true;
  }

  public setCameraToFocus(position?: THREE.Vector3, rotation?: THREE.Quaternion) {
    this.clearTargetCamera();
    // this.controls.target = position;

    this.targetCamera = new THREE.PerspectiveCamera();
    position && this.targetCamera.position.copy(position);
    rotation && this.targetCamera.rotation.setFromQuaternion(rotation);

    this._helper = new THREE.CameraHelper(this.targetCamera);
    this._helper.position.copy(this.targetCamera.position);
    this._helper.rotation.copy(this.targetCamera.rotation);
  }

  public get hoveredObject() {
    return this._hovered;
  }

  public get selectedObject() {
    return this._selected;
  }

  public selectFromPointer() {
    this._selected = !this._hovered
      ? null
      : new RenderPipelineIntersection(this._hovered.intersect);
    this.emit("on_click");
  }

  public selectFromParam(obj: THREE.Object3D) {
    this._selected = RenderPipelineIntersection.createFromObject(obj);
    this.emit("on_click");
  }
}
