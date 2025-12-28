import "bootstrap-icons/font/bootstrap-icons.css";
import "@/styles/base.css";
import "@/styles/three.css";
import "@/styles/ui.css";
import "@/styles/core.css";
import "@/styles/other.css";

import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot

import { AppContextProvider } from "@/context/app-context";
import FullInterface from "@/interface";
import GalaxyViewer from "@/interface/galaxy-viewer";

export const App: React.FC = () => {
  return (
    <AppContextProvider value={null}>
      <GalaxyViewer />
      <FullInterface />
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
