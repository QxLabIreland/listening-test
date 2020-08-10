// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { unmountComponentAtNode } from "react-dom";
import 'mobx-react/batchingForReactDom'

export let jestTestContainer: HTMLDivElement = null;
beforeEach(() => {
  // setup a DOM element as a render target
  jestTestContainer = document.createElement("div");
  document.body.appendChild(jestTestContainer);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(jestTestContainer);
  jestTestContainer.remove();
  jestTestContainer = null;
});
