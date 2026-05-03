import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../contexts';
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userLoggedIn, userLoggedOut } from '../../actions';
import * as Yup from 'yup';
import axios from 'axios';

export const LoginPage = () => {
    const { authDispatch } = useContext(AppContext);
    const [authError, setAuthError] = useState(null);
    let history = useHistory();

    useEffect(() => {
        authDispatch(userLoggedOut());
        localStorage.removeItem('userInfo');
    }, [authDispatch]);

    const onSubmit = async(values) => {
        try {
            const res = await axios.post('/auth/login', values);
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            authDispatch(userLoggedIn(res.data));
            history.push('/');
        } catch (error) {
            setAuthError(error);
        }
    }

    return (
        <div className="container">
            <h3 className="title">LOG IN</h3>
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                validationSchema={Yup.object({
                    username: Yup.string().required('Required'),
                    password: Yup.string().required('Required'),
                })}
                onSubmit={onSubmit}>
                <Form>
                    <div className="field">
                        <label className="label" htmlFor="username">Name</label>
                        <div className="control">
                            <Field name="username" type="text" data-testid="name" autoFocus />
                        </div>
                        <p className="help is-danger" data-testid="nameErrors">
                            <ErrorMessage name="username" />
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
