import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { CategoryForm } from "./CategoryForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { CreateCategoryUseCase } from "../../../application";
import { Category } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockedCreateCategoryUseCase = {
  execute: jest.fn(),
};

const mockedUpdateCategoryUseCase = {
  execute: jest.fn(),
};

const useCaseFactory = {
  get: (useCase) => (useCase == CreateCategoryUseCase ? mockedCreateCategoryUseCase : mockedUpdateCategoryUseCase),
};

const renderWithContextAndRouterForExistingCategory = () => {
  const context = { auth: { info: {} }, useCaseFactory };

  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/categories/2/edit`]}>
          <Route path="/categories/:categoryId/edit">
            <CategoryForm category={new Category({ id: 2, name: "category", description: "desc" })} />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

const renderWithContextAndRouterForNewCategory = () => {
  const context = { auth: { info: {} }, useCaseFactory };

  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/categories/new`]}>
          <Route path="/categories/new">
            <CategoryForm category={Category.createEmpty()} />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("CategoryForm", () => {
  it("should match the snapshot for an existing category", async () => {
    const { asFragment } = renderWithContextAndRouterForExistingCategory();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should match the snapshot for a new category", async () => {
    const { asFragment } = renderWithContextAndRouterForNewCategory();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should allow cancel", async () => {
    const { getByTestId } = renderWithContextAndRouterForNewCategory();

    await waitFor(() => {
      fireEvent.click(getByTestId("cancel"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/categories");
    mockHistoryPush.mockClear();
  });

  it("should require category name", async () => {
    const { getByTestId } = renderWithContextAndRouterForNewCategory();

    await waitFor(() => {
      fireEvent.click(getByTestId("submit"));
    });

    expect(getByTestId("nameErrors")).toHaveTextContent("Required");
  });

  it("should update an existing category", async () => {
    let container;
    await act(async () => {
      container = renderWithContextAndRouterForExistingCategory(false);
    });

    await changeInputValue(container.getByTestId, "name", "Updated Cat");
    await changeInputValue(container.getByTestId, "description", "updated desc");

    mockedUpdateCategoryUseCase.execute.mockResolvedValue({ id: 2 });

    await waitFor(() => {
      fireEvent.click(container.getByTestId("submit"));
    });

    expect(mockedUpdateCategoryUseCase.execute).toHaveBeenCalled();

    const user = new Category({ id: 2, name: "Updated Cat", description: "updated desc" });
    expect(mockedUpdateCategoryUseCase.execute.mock.calls[0][0]).toStrictEqual(user);

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/categories");
    mockHistoryPush.mockClear();
  });

  it("should create a new category", async () => {
    const { getByTestId } = renderWithContextAndRouterForNewCategory();

    await changeInputValue(getByTestId, "name", "New Cat");
    await changeInputValue(getByTestId, "description", "desc");

    mockedCreateCategoryUseCase.execute.mockResolvedValue({ id: 55 });

    await waitFor(() => {
      fireEvent.click(getByTestId("submit"));
    });

    expect(mockedCreateCategoryUseCase.execute).toHaveBeenCalled();

    const category = new Category({ id: -1, name: "New Cat", description: "desc" });
    expect(mockedCreateCategoryUseCase.execute.mock.calls[0][0]).toStrictEqual(category);

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/categories");
    mockHistoryPush.mockClear();
  });

  const changeInputValue = async (getByTestId, name, value) => {
    await waitFor(() => {
      fireEvent.change(getByTestId(name), {
        target: {
          value: value,
        },
      });
    });
  };
});
