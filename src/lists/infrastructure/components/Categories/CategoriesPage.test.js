import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { CategoriesPage } from "./CategoriesPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { Category } from "../../../domain";

afterEach(cleanup);

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const history = createMemoryHistory();

const renderWithContextAndRouter = () => {
  const fakeGetCategoriesUseCase = {
    execute: () => [
      new Category({ id: 1, name: "category1", description: "desc1", isFavourite: false }),
      new Category({ id: 2, name: "category2", description: "desc2", isFavourite: true }),
    ],
  };

  const useCaseFactory = {
    get: () => fakeGetCategoriesUseCase,
  };

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <Router history={history}>
          <CategoriesPage />
        </Router>
      </AppContext.Provider>
    ),
  };
};

describe("CategoriesPage", () => {
  it("should match the snapshot", async () => {
    let fragment;
    await act(async () => {
      const { asFragment } = renderWithContextAndRouter();
      fragment = asFragment;
    });

    expect(fragment()).toMatchSnapshot();
  });

  it("should add a new category", async () => {
    const container = renderWithContextAndRouter();

    await waitFor(() => {
      fireEvent.click(container.getByTestId("addNew"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/categories/new");
    mockHistoryPush.mockClear();
  });

  it("should view the category", async () => {
    const container = renderWithContextAndRouter();

    await waitFor(() => {
      fireEvent.click(container.getByTestId("viewCategory2"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/categories/2");
    mockHistoryPush.mockClear();
  });

  it("should delete the category", async () => {
    const container = renderWithContextAndRouter();

    await waitFor(() => {
      fireEvent.click(container.getByTestId("deleteCategory2"));
    });

    expect(history.location.pathname).toBe("/categories/2/delete");
  });
});
