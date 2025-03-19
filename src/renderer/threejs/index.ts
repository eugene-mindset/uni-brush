import * as THREE from "three";
import { MapControls } from "three/examples/jsm/Addons.js";

import { StarSystemManager } from "@/models/star-system";
import { Position } from "@/types";

import { StarSystemVisual } from "./objects/star-system-visual";

export const mountMainThreeRenderer = (mountRef: { current: HTMLDivElement | null }) => {
  const newPositions: Position[] = new Array();
  for (let index = 0; index < StarSystemManager.capacity; index++) {
    const vec = new THREE.Vector3().randomDirection();
    const radius = Math.random();
    newPositions.push({
      x: vec.x * 200 * radius,
      y: vec.y * 10 * Math.random(),
      z: vec.z * 200 * radius,
    });
  }

  StarSystemManager.batchInitializeValue("initPos", newPositions);
  StarSystemManager.batchInitializeEntites();

  // Scene, camera, and renderer setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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

  const systemCollection: StarSystemVisual[] = [];
  for (const starSystem of StarSystemManager.getAll()) {
    const starSystemVisual = new StarSystemVisual(
      starSystem.publicId,
      new THREE.Vector3(
        starSystem.initialPosition.x,
        starSystem.initialPosition.y,
        starSystem.initialPosition.z
      )
    );

    scene.add(starSystemVisual.object3D);
    systemCollection.push(starSystemVisual);
  }

  camera.position.copy(new THREE.Vector3(0, 300, 0));
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();

  // Handle resizing
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", handleResize);

  // Cleanup function
  return () => {
    window.removeEventListener("resize", handleResize);
    mountRef.current?.removeChild(renderer.domElement);
    renderer.dispose();
    systemCollection.forEach((x) => x.dispose());
  };
};
