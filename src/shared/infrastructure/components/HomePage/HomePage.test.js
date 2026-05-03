import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { HomePage } from "./HomePage";
import { AppContext } from "../../contexts";
import { createMemoryHistory } from "history";

const mockHistoryPush = jest.fn();
let mockUseCaseFactory;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

beforeEach(() => {
  const mockUseCase = {
    execute: jest.fn(() => Promise.resolve([])),
  };
  mockUseCaseFactory = {
    get: jest.fn(() => mockUseCase),
  };
});

const renderWithRouterAndContext = (auth) => {
  const history = createMemoryHistory();
  const context = { auth, useCaseFactory: mockUseCaseFactory };
  return {
    ...render(
      <AppContext.Provider value={context}>
        <Router history={history}>
          <HomePage />
        </Router>
      </AppContext.Provider>
    ),
  };
};

afterEach(cleanup);

describe("HomePage", () => {
  describe("when the user is an admin", () => {
    it("should match the snapshot", () => {
      const { asFragment } = renderWithRouterAndContext({
        info: { isAdmin: true },
      });

      expect(asFragment()).toMatchSnapshot();
    });

    const allowedUrlsForAdmins = [
      { url: "/users", testId: "users" },
      { url: "/refreshtokens", testId: "refreshTokens" },
      { url: "/index-all-lists", testId: "indexLists" },
      { url: "/lists", testId: "lists" },
      { url: "/categories", testId: "categories" },
    ];

    allowedUrlsForAdmins.forEach(({ url, testId }) => {
      it(`should allow to go to ${url}`, async () => {
        const { getByTestId } = renderWithRouterAndContext({
          info: { isAdmin: true },
        });

        await waitFor(() => {
          fireEvent.click(getByTestId(testId));
        });

        expect(mockHistoryPush).toHaveBeenCalled();
        expect(mockHistoryPush.mock.calls[0][0]).toBe(url);
      });
    });
  });

  describe("when the user is not an admin", () => {
    const allowedUrlsForNonAdmins = [
      { url: "/lists", testId: "lists" },
      { url: "/categories", testId: "categories" },
    ];

    allowedUrlsForNonAdmins.forEach(({ url, testId }) => {
      it(`should allow to go to ${url}`, async () => {
        const { getByTestId } = renderWithRouterAndContext({
          info: { isAdmin: true },
        });

        await waitFor(() => {
          fireEvent.click(getByTestId(testId));
        });

        expect(mockHistoryPush).toHaveBeenCalled();
        expect(mockHistoryPush.mock.calls[0][0]).toBe(url);
      });
    });
  });
});
