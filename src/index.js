import React from "react";
import { render } from "react-dom";
import App from "./App";

const rootElement = document.querySelector("#root");
if (rootElement) {
  render(<App />, rootElement);
}
