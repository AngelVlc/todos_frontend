import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppContext } from '../contexts';

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const { auth } = useContext(AppContext);

    return (
        <Route {...rest} render={props => (
            auth.info
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )} />
    )
}
