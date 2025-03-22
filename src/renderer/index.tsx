`use client`;

import { render, FunctionComponent } from "preact";

import "@/styles/global.css";
import GalaxyViewer from "./galaxy-viewer";
import MainMenu from "./interface/main-menu";
import { MainViewContextProvider } from "@/store/main-view-contex";
import { AppContextProvider } from "@/store/app-context";

const App: FunctionComponent<{}> = ({}) => {
  return (
    <AppContextProvider value={{}}>
      <MainViewContextProvider value={{}}>
        <GalaxyViewer />
        <MainMenu />
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
