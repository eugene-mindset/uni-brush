`use client`;

import { render, FunctionComponent } from "preact";

import "@/styles/global.css";
import GalaxyViewer from "./galaxy-viewer";

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
