import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userLoggedIn } from '../../actions'
import { AppContext } from '../../contexts/AppContext'
import * as Yup from 'yup';
import jwt from 'jwt-decode';
import { doGetToken } from '../../helpers/api';

export const LoginPage = () => {
    const { authDispatch, requestsDispatch } = useContext(AppContext)
    const [authError, setAuthError] = useState(null);
    let history = useHistory();

    return (
        <div className="container">
            <h3 className="title">LOG IN</h3>
            <Formik
                initialValues={{
                    userName: '',
                    password: ''
                }}
                validationSchema={Yup.object({
                    userName: Yup.string()
                        .required('Required'),
                    password: Yup.string()
                        .required('Required'),
                })
                }
                onSubmit={async (values) => {
                    try {
                        const res = await doGetToken(values, requestsDispatch);
                        const tokenInfo = jwt(res.token);
                        authDispatch(userLoggedIn(res, tokenInfo));
                        history.push('/');
                    } catch (error) {
                        setAuthError(error);
                    }
                }}>
                <Form>
                    <div className="field">
                        <label className="label" htmlFor="userName">Name</label>
                        <div className="control">
                            <Field name="userName" type="text" data-testid="userName" />
                        </div>
                        <p className="help is-danger" data-testid="userNameErrors">
                            <ErrorMessage name="userName" />
                        </p>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="password">Password</label>
                        <div className="control">
                            <Field name="password" type="password" data-testid="password" />
                        </div>
                        <p className="help is-danger" data-testid="passwordErrors">
                            <ErrorMessage name="password" />
                        </p>
                    </div>
                    <div className="control">
                        <button className="button" type="submit" data-testid="submit">Log In</button>
                        {authError ? (
                            <p className="help is-danger" data-testid="authError">{authError}</p>
                        ) : null}
                    </div>
                </Form>
            </Formik>
        </div>
    );
}
