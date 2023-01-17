import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import Modal from "react-modal";
import "./app.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

Modal.setAppElement("#root");

root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
