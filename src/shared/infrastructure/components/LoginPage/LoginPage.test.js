import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { LoginPage } from "./LoginPage";
import { AppContext } from "../../contexts";
import axios from "axios";

jest.mock("axios");

const mockAuthDispatch = jest.fn();
const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const renderWithContextAndRouter = () => {
  const history = createMemoryHistory();
  const context = { authDispatch: mockAuthDispatch };

  return {
    ...render(
      <AppContext.Provider value={context}>
        <Router history={history}>{<LoginPage />}</Router>
      </AppContext.Provider>
    ),
  };
};

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
    },
    writable: true,
  });
});

afterEach(cleanup);

describe("LoginPage", () => {
  it("should match the snapshot", () => {
    const { asFragment } = renderWithContextAndRouter();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should require user name and password for logging in", async () => {
    const { getByTestId } = renderWithContextAndRouter();

    await waitFor(() => {
      fireEvent.click(getByTestId("submit"));
    });

    expect(getByTestId("nameErrors")).toHaveTextContent("Required");
    expect(getByTestId("passwordErrors")).toHaveTextContent("Required");
  });

  it("should show the error when log in fails", async () => {
    const { getByTestId } = renderWithContextAndRouter();

    await changeInput(getByTestId, "name", "user");
    await changeInput(getByTestId, "password", "pass");

    axios.post.mockRejectedValue("some error");

    await waitFor(() => {
      fireEvent.click(getByTestId("submit"));
    });

    expect(axios.post).toHaveBeenCalled();
    expect(axios.post.mock.calls[0][0]).toBe("/auth/login");
    expect(axios.post.mock.calls[0][1]).toStrictEqual({
      username: "user",
      password: "pass",
    });
    expect(getByTestId("authError")).toHaveTextContent("some error");
    axios.post.mockClear();
  });

  it("should show the home page after logging in", async () => {
    const { getByTestId } = renderWithContextAndRouter();

    await changeInput(getByTestId, "name", "user");
    await changeInput(getByTestId, "password", "pass");

    axios.post.mockResolvedValue({
      data: {
        id: 1,
        name: "name",
        isAdmin: true,
      },
    });

    await waitFor(() => {
      fireEvent.click(getByTestId("submit"));
    });

    expect(axios.post).toHaveBeenCalled();
    expect(axios.post.mock.calls[0][0]).toBe("/auth/login");
    expect(axios.post.mock.calls[0][1]).toStrictEqual({
      password: "pass",
      username: "user",
    });
    expect(window.localStorage.setItem.mock.calls.length).toBe(2);
    expect(window.localStorage.setItem.mock.calls[0][0]).toBe("userInfo");
    expect(window.localStorage.setItem.mock.calls[0][1]).toBe(null);
    expect(window.localStorage.setItem.mock.calls[1][0]).toBe("userInfo");
    expect(window.localStorage.setItem.mock.calls[1][1]).toBe(
      JSON.stringify({ id: 1, name: "name", isAdmin: true })
    );
    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/");
    axios.post.mockClear();
  });

  const changeInput = async (getByTestId, name, value) => {
    await waitFor(() => {
      fireEvent.change(getByTestId(name), {
        target: {
          value: value,
        },
      });
    });
  };
});
