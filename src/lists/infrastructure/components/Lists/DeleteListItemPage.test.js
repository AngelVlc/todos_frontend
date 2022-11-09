import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { DeleteListItemPage } from "./DeleteListItemPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { GetListByIdUseCase } from "../../../application/lists";
import { GetListItemByIdUseCase } from "../../../application/listItems";
import { List, ListItem } from "../../../domain";

const mockHistoryGoBack = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    push: mockHistoryPush,
  }),
}));

const mockedDeleteListItemByIdUseCase = {
  execute: jest.fn(),
};

const renderWithContextAndRouter = () => {
  const fakeGetListByIdUseCase = {
    execute: () => new List({ id: 2, name: "list name" }),
  };

  const fakeGetListItemByIdUseCase = {
    execute: () =>
      new ListItem({
        id: 2,
        title: "item title",
        description: "item desc",
      }),
  };

  const useCaseFactory = {
    get: (useCase) => {
      if (useCase == GetListItemByIdUseCase) {
        return fakeGetListItemByIdUseCase;
      } else if (useCase == GetListByIdUseCase) {
        return fakeGetListByIdUseCase;
      }

      return mockedDeleteListItemByIdUseCase;
    },
  };

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/lists/2/items/5/delete`]}>
          <Route path="/lists/:listId/items/:itemId/delete">
            {<DeleteListItemPage />}
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

it("should match the snapshot", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouter();
    fragment = asFragment;
  });
  expect(fragment()).toMatchSnapshot();
});

it("should cancel the deletion", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter();
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("no"));
  });

  expect(mockHistoryGoBack.mock.calls.length).toBe(1);
  mockHistoryGoBack.mockClear();
});

it("should delete the List", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter();
  });

  mockedDeleteListItemByIdUseCase.execute.mockResolvedValue(true);

  await waitFor(() => {
    fireEvent.click(container.getByTestId("yes"));
  });

  expect(mockedDeleteListItemByIdUseCase.execute.mock.calls.length).toBe(1);
  expect(mockedDeleteListItemByIdUseCase.execute.mock.calls[0][0]).toBe("2");
  expect(mockedDeleteListItemByIdUseCase.execute.mock.calls[0][1]).toBe("5");
  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists/2");
  mockHistoryPush.mockClear();
});
