import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { Header } from "./Header";
import { AppContext } from "../../contexts";
import { createMemoryHistory } from "history";
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

const renderWithRouterAndContext = (auth) => {
  const history = createMemoryHistory();
  const context = { authDispatch: mockAuthDispatch, auth };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <Router history={history}>{<Header />}</Router>
      </AppContext.Provider>
    ),
  };
};

afterEach(() => {
  cleanup();
  axios.post.mockClear();
});

describe("Header", () => {
  it("should do logout", async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const { getByTestId } = renderWithRouterAndContext({
      info: { name: "user" },
    });

    // Open dropdown
    fireEvent.click(getByTestId("userDropdown"));
    
    // Click logout button
    await waitFor(() => {
      fireEvent.click(getByTestId("logOut"));
    });

    expect(axios.post).toHaveBeenCalledWith('/auth/logout');
    expect(mockAuthDispatch).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/login");
  });

  it("should match the snapshot when the user is logged in", () => {
    const { asFragment } = renderWithRouterAndContext({
      info: { name: "user" },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it("should match the snapshot when an admin user is logged in", () => {
    const { asFragment } = renderWithRouterAndContext({
      info: { name: "admin", isAdmin: true },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it("should go to root", async () => {
    const { getByTestId } = renderWithRouterAndContext({
      info: { name: "user" },
    });

    await waitFor(() => {
      fireEvent.click(getByTestId("goToRoot"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/");
  });

  it("should go to lists", async () => {
    const { getByTestId } = renderWithRouterAndContext({
      info: { name: "user" },
    });

    await waitFor(() => {
      fireEvent.click(getByTestId("goToLists"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/lists");
  });

  it("should go to categories", async () => {
    const { getByTestId } = renderWithRouterAndContext({
      info: { name: "user" },
    });

    await waitFor(() => {
      fireEvent.click(getByTestId("goToCategories"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/categories");
  });

  it("should go to users", async () => {
    const { getByTestId } = renderWithRouterAndContext({
      info: { name: "user", isAdmin: true },
    });

    await waitFor(() => {
      fireEvent.click(getByTestId("goToUsers"));
    });

    expect(mockHistoryPush).toHaveBeenCalled();
    expect(mockHistoryPush.mock.calls[0][0]).toBe("/users");
  });
});
