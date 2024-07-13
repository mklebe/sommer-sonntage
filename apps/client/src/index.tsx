import { createRoot } from "react-dom/client";

import { App } from "./App";

import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const rootDomNode = document.createElement("div");
  rootDomNode.id = "root";
  document.body.appendChild(rootDomNode);

  const reactRoot = createRoot(rootDomNode);
  reactRoot.render(<App />);
});
