`use client`;

import { render, FunctionComponent } from "preact";

import "@/styles/global.css";
import GalaxyViewer from "./galaxy-viewer";

// TOOD: add a wait for page to render
// const init = () => {
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );

//   const geometry = new THREE.BoxGeometry(1, 1, 1);
//   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//   const cube = new THREE.Mesh(geometry, material);
//   scene.add(cube);

//   camera.position.z = 5;

//   const animate = () => {
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;

//     renderer.render(scene, camera);
//   };

//   const renderer = new THREE.WebGLRenderer();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.setAnimationLoop(animate);
//   document.body.appendChild(renderer.domElement);
// };

// init();
// window.ipcRenderer.on('main-process-loaded', () => {

// });

const App: FunctionComponent<{}> = ({}) => {
  return (
    <>
      <GalaxyViewer />
    </>
  );
};

const appElement = document.getElementById("app");
if (appElement) {
  render(<App />, appElement);
}

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
