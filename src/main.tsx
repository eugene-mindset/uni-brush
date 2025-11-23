`use client`;

import { render, FunctionalComponent } from "preact";

import "@/styles/base.css";
import "@/styles/three.css";
import "@/styles/ui.css";
import "@/styles/core.css";
import "@/styles/other.css....";

import GalaxyViewer from "./interface/galaxy-viewer";
import FullInterface from "./interface";
import { MainViewContextProvider } from "@/store/main-view-context";
import { AppContextProvider } from "@/store/app-context";

const App: FunctionalComponent<{}> = ({}) => {
  return (
    <AppContextProvider value={{}}>
      <MainViewContextProvider value={{}}>
        <GalaxyViewer />
        <FullInterface />
      </MainViewContextProvider>
    </AppContextProvider>
  );
};

const appElement = document.getElementById("app");
if (appElement) {
  render(<App />, appElement);
}

window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
