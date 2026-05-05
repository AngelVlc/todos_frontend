import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { EditListPage } from "./EditListPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { List, ListItem } from "../../../domain";
import { GetListByIdUseCase, GetCategoriesUseCase } from "../../../application";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouter = () => {
  const fakeGetListByIdUseCase = {
    execute: () => {
      const list = new List({
        id: 2,
        name: "list name",
        categoryId: 1,
        items: [
          new ListItem({
            id: 5,
            title: "item title",
            description: "item description",
          }),
        ],
      });
      return list;
    },
  };

  const fakeGetCategoriesUseCase = {
    execute: () => [
      { id: 1, name: "category1" },
    ],
  };

  const useCaseFactory = {
    get: (useCase) => {
      switch(useCase) {
        case GetListByIdUseCase:
          return fakeGetListByIdUseCase;
        case GetCategoriesUseCase:
          return fakeGetCategoriesUseCase;
      };
    },
  };

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2`]}>
          <Route path="/lists/:listId">
            <EditListPage />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("EditListPage", () => {
  it("should match the snapshot for an existing list", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouter();
      fragment = asFragment;
    });

    expect(fragment()).toMatchSnapshot();
  });
});
