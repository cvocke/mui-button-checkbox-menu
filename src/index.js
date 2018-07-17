import React from "react";
import { render } from "react-dom";
import ButtonCheckboxMenu from "./ButtonCheckboxMenu";
import App from "./App";

const rootElement = document.querySelector("#root");
if (rootElement) {
  render(<App />, rootElement);
}
