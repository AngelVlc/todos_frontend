import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { UserForm } from "./UserForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { CreateUserUseCase } from "../../../application/users";
import { User } from "../../../domain";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockedCreateUserUseCase = {
  execute: jest.fn(),
};

const mockedUpdateUserUseCase = {
  execute: jest.fn(),
};

const useCaseFactory = {
  get: (useCase) =>
    useCase == CreateUserUseCase
      ? mockedCreateUserUseCase
      : mockedUpdateUserUseCase,
};

const renderWithContextAndRouterForExistingUser = (isAdmin) => {
  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/users/2/edit`]}>
          <Route path="/users/:userId/edit">
            <UserForm user={new User({ id: 2, name: "user", isAdmin })} />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

const renderWithContextAndRouterForNewUser = () => {
  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={[`/users/new`]}>
          <Route path="/users/new">
            <UserForm user={User.createEmpty()} />
          </Route>
        </MemoryRouter>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("UserForm", () => {
  it("should match the snapshot for an existing non admin user", async () => {
    const { asFragment } = renderWithContextAndRouterForExistingUser(false);

    expect(asFragment()).toMatchSnapshot();
  });

  it("should match the snapshot for an existing admin user", async () => {
    const { asFragment } = renderWithContextAndRouterForExistingUser(true);

    expect(asFragment()).toMatchSnapshot();
  });

  it("should match the snapshot for a new user", async () => {
    const { asFragment } = renderWithContextAndRouterForNewUser();
    
    expect(asFragment()).toMatchSnapshot();
  });

  it("should allow cancel", async () => {
    const { getByTestId } = renderWithContextAndRouterForNewUser();

    await waitFor(() => {
      fireEvent.click(getByTestId("cancel"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
    mockHistoryPush.mockClear();
  });

  it("should require user name", async () => {
    const { getByTestId } = renderWithContextAndRouterForNewUser();

    await waitFor(() => {
      fireEvent.click(getByTestId("submit"));
    });

    expect(getByTestId("nameErrors")).toHaveTextContent("Required");
  });

  it("should update an existing user", async () => {
    let container;
    await act(async () => {
      container = renderWithContextAndRouterForExistingUser(false);
    });

    await changeInputValue(container.getByTestId, "name", "updated user");
    await changeInputValue(container.getByTestId, "password", "pass");
    await changeInputValue(container.getByTestId, "confirmPassword", "pass");
    await waitFor(() => {
      fireEvent.click(container.getByTestId("isAdmin"));
    });

    mockedUpdateUserUseCase.execute.mockResolvedValue({ id: 2 });

    await waitFor(() => {
      fireEvent.click(container.getByTestId("submit"));
    });

    expect(mockedUpdateUserUseCase.execute).toHaveBeenCalled();

    const user = new User({ id: 2, name: "updated user", isAdmin: true });
    user.password = "pass";
    user.confirmPassword = "pass";
    expect(mockedUpdateUserUseCase.execute.mock.calls[0][0]).toStrictEqual(
      user
    );

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
    mockHistoryPush.mockClear();
  });

  it("should create a new user", async () => {
    const { getByTestId } = renderWithContextAndRouterForNewUser();

    await changeInputValue(getByTestId, "name", "new user");
    await changeInputValue(getByTestId, "password", "pass");
    await changeInputValue(getByTestId, "confirmPassword", "pass");

    mockedCreateUserUseCase.execute.mockResolvedValue({ id: 55 });

    await waitFor(() => {
      fireEvent.click(getByTestId("submit"));
    });

    expect(mockedCreateUserUseCase.execute).toHaveBeenCalled();

    const user = new User({ name: "new user", isAdmin: false });
    user.password = "pass";
    user.confirmPassword = "pass";
    expect(mockedCreateUserUseCase.execute.mock.calls[0][0]).toStrictEqual(
      user
    );

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
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
