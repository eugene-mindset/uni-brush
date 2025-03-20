`use client`;

import { render, FunctionComponent } from "preact";

import "@/styles/global.css";
import GalaxyViewer from "./galaxy-viewer";
import MainMenu from "./interface/main-menu";

const App: FunctionComponent<{}> = ({}) => {
  return (
    <>
      <GalaxyViewer />
      <MainMenu />
    </>
  );
};

const appElement = document.getElementById("app");
if (appElement) {
  render(<App />, appElement);
}

window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
