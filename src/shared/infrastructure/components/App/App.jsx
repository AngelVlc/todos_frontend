import React, { useReducer, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { AdminRoute, PrivateRoute } from '../../routers';
import { LoginPage } from '../LoginPage';
import { HomePage } from '../HomePage';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { ListsPage, NewListPage, ViewListPage, EditListPage, DeleteListPage, MoveListItemPage } from '../../../../lists/infrastructure/components/Lists';
import { DeleteUserPage } from '../../../../auth/infrastructure/components/DeleteUserPage';
import { UsersPage } from '../../../../auth/infrastructure/components/UsersPage';
import { NewUserPage } from '../../../../auth/infrastructure/components/NewUserPage';
import { EditUserPage } from '../../../../auth/infrastructure/components/EditUserPage';
import { RefreshTokensPage } from '../../../../auth/infrastructure/components/RefreshTokensPage';
import { IndexAllListsPage } from '../../../../lists/infrastructure/components/IndexAllListsPage';
import { CategoriesPage, NewCategoryPage, EditCategoryPage, DeleteCategoryPage } from '../../../../lists/infrastructure/components/Categories';
import { createBrowserHistory } from 'history';
import { loginReducer, requestsReducer } from '../../reducers';
import { AppContext } from '../../contexts';
import { requestErrorShowed, userLoggedIn} from '../../actions';
import { useAlert } from 'react-alert';
import { UseCaseFactory } from '../../UseCaseFactory';
import Loader from 'react-loader-spinner';
import * as axiosConfigure from '../../axiosConfigure';
import './App.css';

const browserHistory = createBrowserHistory();
const useCaseFactory = new UseCaseFactory()

const App = () => {
  const [auth, authDispatch] = useReducer(loginReducer, []);
  const [request, requestsDispatch] = useReducer(requestsReducer, []);
  const alert = useAlert();

  useEffect(() => {
    if (request.error) {
      alert.show(request.error);
      requestsDispatch(requestErrorShowed())
    }
  }, [request.error, alert, requestsDispatch]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      authDispatch(userLoggedIn(userInfo));
    }
    axiosConfigure.configure(requestsDispatch, browserHistory);
  }, [authDispatch]);

  return (
    <div className="is-flex is-flex-direction-column">
      <AppContext.Provider value={{ auth, authDispatch, useCaseFactory }}>
        <Router history={browserHistory}>
          <Header />
          {request.pending &&
            <div className="loader-container">
              <div className="loader-item">
                <center>
                  <Loader type="Circles" color="#282c34" height="100" width="100" />
                </center>
              </div>
            </div>
          }
          <section className="section is-flex-grow-2">
            <Switch>
              <PrivateRoute exact path="/" component={HomePage} />
              <PrivateRoute exact path="/lists" component={ListsPage} />
              <PrivateRoute path="/lists/new" component={NewListPage} />
              <PrivateRoute path="/lists/:listId/delete" component={DeleteListPage} />
              <PrivateRoute path="/lists/:listId/moveItem/:listItemId" component={MoveListItemPage} />
              <PrivateRoute path="/lists/:listId/read" component={ViewListPage} />
              <PrivateRoute path="/lists/:listId" component={EditListPage} />
              <PrivateRoute exact path="/categories" component={CategoriesPage} />
              <PrivateRoute path="/categories/new" component={NewCategoryPage} />
              <PrivateRoute path="/categories/:categoryId/delete" component={DeleteCategoryPage} />
              <PrivateRoute path="/categories/:categoryId" component={EditCategoryPage} />
              <PrivateRoute path="/categories/:categoryId/lists" component={ListsPage} />
              <AdminRoute exact path="/users" component={UsersPage} />
              <AdminRoute path="/users/:userId/delete" component={DeleteUserPage} />
              <AdminRoute path="/users/:userId/edit" component={EditUserPage} />
              <AdminRoute path="/users/new" component={NewUserPage} />
              <AdminRoute exact path="/refreshtokens" component={RefreshTokensPage} />
              <AdminRoute exact path="/index-all-lists" component={IndexAllListsPage} />
              <Route path="/login">
                <LoginPage />
              </Route>
              <Redirect from="*" to="/" />
            </Switch>
          </section>
          <Footer />
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export { App };
