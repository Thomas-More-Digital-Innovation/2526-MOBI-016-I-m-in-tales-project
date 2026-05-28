import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./app/globals.css";

// prevent the webview from trying to navigate to dropped files
document.addEventListener("dragover", (e) => e.preventDefault(), { capture: true });
document.addEventListener("drop", (e) => e.preventDefault(), { capture: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
