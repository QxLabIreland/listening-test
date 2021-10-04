import React from "react";
import {render} from "react-dom";
import {act} from "react-dom/test-utils";
import {TestDetailView} from "./TestDetailView";
import {AbAddItemButtonGroup} from "../../../components/audio/AbTest/AbAddItemButtonGroup";
import {MemoryRouter} from "react-router";
import Axios, {AxiosResponse} from "axios";
import {BasicTaskItemModel, BasicTaskModel} from "../../../shared/models/BasicTaskModel";
import {jestTestContainer as container} from "../../../setupTests";
import {TestDetailItemCardList} from "./TestDetailItemCardList";

it("render loading animation", () => {
  act(() => {
    render(<MemoryRouter initialEntries={["/user/ab-test/0"]}>
      <TestDetailView testUrl="ab-test" ButtonGroup={AbAddItemButtonGroup}/>
    </MemoryRouter>, container);
  });
  expect(container.textContent).toBe("Loading...");
});

it("renders detail data of a test", async () => {
  const fakeUser = {
    name: "Joni Baez",
    description: 'This is the description',
    items: []
  } as BasicTaskModel;
  jest.spyOn(Axios, "get").mockImplementation(() =>
    Promise.resolve({data: fakeUser} as AxiosResponse<BasicTaskModel>)
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<MemoryRouter initialEntries={["/user/ab-test/1"]}>
      <TestDetailView testUrl="ab-test" ButtonGroup={AbAddItemButtonGroup}/>
  </MemoryRouter>, container);
  });

  expect(container.querySelector<HTMLInputElement>("input[name='name']").value).toBe(fakeUser.name);
  expect(container.querySelector("[name='description']").textContent).toBe(fakeUser.description);
});

it("reorder test item card in the list", () => {
  const items = [] as BasicTaskItemModel[];
  act(() => {
    render(<TestDetailItemCardList items={items} testUrl="ab-test"/>, container);
  });
  expect(container.textContent).toBe("");
});
