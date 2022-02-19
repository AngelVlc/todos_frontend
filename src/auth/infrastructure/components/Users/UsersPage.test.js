import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { UsersPage } from "./UsersPage";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { User } from "../../../domain";

afterEach(cleanup);

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const history = createMemoryHistory();

const renderWithContextAndRouter = (component) => {
  const mockedGetUsersUseCase = {
    execute: () => {
      return [
        new User({ id: 1, name: "user1", isAdmin: true }),
        new User({ id: 2, name: "user2", isAdmin: false }),
      ];
    },
  };

  const useCaseFactory = {
    get: () => {
      return mockedGetUsersUseCase;
    },
  };

  const context = { auth: { info: {} }, useCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <Router history={history}>{component}</Router>
      </AppContext.Provider>
    ),
  };
};

it("should match the snapshot", async () => {
  let fragment;
  await act(async () => {
    const { asFragment } = renderWithContextAndRouter(<UsersPage />);
    fragment = asFragment;
  });
  expect(fragment(<UsersPage />)).toMatchSnapshot();
});

it("should add a new user", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter(<UsersPage />);
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("addNew"));
  });

  expect(mockHistoryPush.mock.calls.length).toBe(1);
  expect(mockHistoryPush.mock.calls[0][0]).toBe("users/new");
  mockHistoryPush.mockClear();
});

it("should edit the user", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter(<UsersPage />);
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("editUser2"));
  });

  expect(history.location.pathname).toBe("/users/2/edit");
});

it("should delete the user", async () => {
  let container;
  await act(async () => {
    container = renderWithContextAndRouter(<UsersPage />);
  });

  await waitFor(() => {
    fireEvent.click(container.getByTestId("deleteUser2"));
  });

  expect(history.location.pathname).toBe("/users/2/delete");
});