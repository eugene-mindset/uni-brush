`use client`;

import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot

import { AppContextProvider } from "@/context/app-context";
import { MainViewContextProvider } from "@/context/main-view-context";

import GalaxyViewer from "@/interface/galaxy-viewer";
import FullInterface from "@/interface";

import "bootstrap-icons/font/bootstrap-icons.css";

import "@/styles/base.css";
import "@/styles/three.css";
import "@/styles/ui.css";
import "@/styles/core.css";
import "@/styles/other.css";

const App: React.FC = () => {
  return (
    <AppContextProvider value={{}}>
      <MainViewContextProvider value={null}>
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
