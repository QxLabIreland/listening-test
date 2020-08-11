import {act} from "react-dom/test-utils";
import {render} from "react-dom";
import {AbAddItemButtonGroup} from "./AbAddItemButtonGroup";
import React from "react";
import {jestTestContainer as container} from "../../setupTests";

it("Add button behaviour", () => {
  const onAdd = jest.fn();
  act(() => {
    render(<AbAddItemButtonGroup onAdd={onAdd}/>, container)
  });
  const exAddButton = container.querySelector("[data-testid='buttonAddEx']")
  act(() => {
    exAddButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  });
  expect(onAdd).toHaveBeenCalledTimes(1);
});

