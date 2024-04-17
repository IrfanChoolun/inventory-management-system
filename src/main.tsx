import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";

import "./demos/ipc";
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

// window.ipcRenderer.on("clear-storage", () => {
//   localStorage.clear();
//   console.log("Local storage cleared");
// });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
