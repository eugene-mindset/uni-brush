`use client`;

import { render, FunctionalComponent } from "preact";

import "@/styles/global.css";
import GalaxyViewer from "./galaxy-viewer";
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
