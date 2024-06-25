import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <div className="viewer">
      <h1>Hello, World!</h1>
    </div>
  );
}

const template = document.createElement("template");
template.innerHTML = `
  <style>
    html,
    body,
    .viewer {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>
`;

class BingoClient extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    const reactRoot = createRoot(shadowRoot);

    reactRoot.render(<App />);
  }
}

customElements.define("bingo-client", BingoClient);
