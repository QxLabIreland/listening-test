import React from "react";
import {render} from "react-dom";
import {act} from "react-dom/test-utils";
import {TestDetailView} from "./TestDetailView";
import {AbTestItemExampleCard} from "../AbTest/AbTestItemExampleCard";
import {AbAddItemButtonGroup} from "../AbTest/AbAddItemButtonGroup";
import {MemoryRouter} from "react-router";
import Axios, {AxiosResponse} from "axios";
import {BasicTestModel, TestItemModel} from "../../shared/models/BasicTestModel";
import {jestTestContainer as container} from "../../setupTests";
import {TestDetailItemCardList} from "./TestDetailItemCardList";

it("render loading animation", () => {
  act(() => {
    render(<MemoryRouter initialEntries={["/user/ab-test/0"]}>
      <TestDetailView testUrl="ab-test" TestItemExampleCard={AbTestItemExampleCard} ButtonGroup={AbAddItemButtonGroup}/>
    </MemoryRouter>, container);
  });
  expect(container.textContent).toBe("Loading...");
});

it("renders detail data of a test", async () => {
  const fakeUser = {
    name: "Joni Baez",
    description: 'This is the description',
    items: []
  } as BasicTestModel;
  jest.spyOn(Axios, "get").mockImplementation(() =>
    Promise.resolve({data: fakeUser} as AxiosResponse<BasicTestModel>)
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<MemoryRouter initialEntries={["/user/ab-test/1"]}>
      <TestDetailView testUrl="ab-test" TestItemExampleCard={AbTestItemExampleCard} ButtonGroup={AbAddItemButtonGroup}/>
  </MemoryRouter>, container);
  });

  expect(container.querySelector<HTMLInputElement>("input[name='name']").value).toBe(fakeUser.name);
  expect(container.querySelector("[name='description']").textContent).toBe(fakeUser.description);
});

it("reorder test item card in the list", () => {
  const items = [] as TestItemModel[];
  act(() => {
    render(<TestDetailItemCardList items={items} TestItemExampleCard={AbTestItemExampleCard} />, container);
  });
  expect(container.textContent).toBe("");
});
