import React, { useReducer, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { AdminRoute, PrivateRoute } from '../../routers';
import { LoginPage } from '../LoginPage';
import { HomePage } from '../HomePage';
import { ListsPage, ListPage, ListDeletePage, ListItemPage, ListItemDeletePage } from '../Lists';
import { UserDeletePage, UsersPage, UserPage } from '../Users';
import { Header } from '../Header';
import { createBrowserHistory } from "history";
import { authReducer, requestsReducer } from '../../reducers';
import { AppContext } from '../../contexts/AppContext';
import { requestErrorShowed } from '../../actions';
import Loader from 'react-loader-spinner';
import { useAlert } from 'react-alert'
import { doRefreshToken } from '../../helpers/api';
// import { userLoggedIn } from '../../actions'
import './App.css';

const history = createBrowserHistory();

const App = () => {
  const [auth, authDispatch] = useReducer(authReducer, [])
  const [request, requestsDispatch] = useReducer(requestsReducer, [])
  const alert = useAlert()

  useEffect(() => {
    if (request.error) {
      alert.show(request.error);
      requestsDispatch(requestErrorShowed())
    }
  }, [request.error, alert, requestsDispatch]);

  useEffect(() => {
    if (auth.info && auth.info.token) {
      const expInSeconds = (auth.info.exp * 1000) - new Date().getTime() - 15000;
      console.log(expInSeconds, new Date(auth.info.exp * 1000), auth.info);
      setTimeout(async () => {
          console.log(new Date())
          const res = await doRefreshToken();
          console.log('refreshToken', res);
          // authDispatch(userLoggedIn(res, ));
      }, expInSeconds);
    }
  }, [auth.info, authDispatch]);

  return (
    <AppContext.Provider value={{ auth, request, authDispatch, requestsDispatch }}>
      <Router history={history}>
        <Header />
        {request.pending &&
          <div className="reactLoader">
            <Loader type="Circles" color="#282c34" height="100" width="100" />
          </div>
        }
        <section className="section">
          <Switch>
            <PrivateRoute exact path="/" component={HomePage} />
            <PrivateRoute exact path="/lists" component={ListsPage} />
            <AdminRoute path="/lists/new" component={ListPage} />
            <AdminRoute path="/lists/:listId/delete" component={ListDeletePage} />
            <AdminRoute path="/lists/:listId/edit" component={ListPage} />
            <AdminRoute path="/lists/:listId/items/new" component={ListItemPage} />
            <AdminRoute path="/lists/:listId/items/:itemId/delete" component={ListItemDeletePage} />
            <AdminRoute path="/lists/:listId/items/:itemId/edit" component={ListItemPage} />
            <AdminRoute exact path="/users" component={UsersPage} />
            <AdminRoute path="/users/:userId/delete" component={UserDeletePage} />
            <AdminRoute path="/users/:userId/edit" component={UserPage} />
            <AdminRoute path="/users/new" component={UserPage} />
            <Route path="/login">
              <LoginPage />
            </Route>
            <Redirect from="*" to="/" />
          </Switch>
        </section>
      </Router>
    </AppContext.Provider>
  );
}

export { App };
