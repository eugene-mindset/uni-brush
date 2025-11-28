`use client`;

import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot

import { AppContextProvider } from "@/store/app-context";
import { MainViewContextProvider } from "@/store/main-view-context";

import GalaxyViewer from "@/interface/galaxy-viewer";
import FullInterface from "@/interface";

import "@/styles/base.css";
import "@/styles/three.css";
import "@/styles/ui.css";
import "@/styles/core.css";
import "@/styles/other.css";

const App: React.FC = () => {
  return (
    <AppContextProvider value={{}}>
      <MainViewContextProvider value={{}}>
        <GalaxyViewer />
        <FullInterface />
      </MainViewContextProvider>
    </AppContextProvider>
  );
};

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
