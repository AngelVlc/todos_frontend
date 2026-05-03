import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../contexts';
import { useHistory, Redirect } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userLoggedIn, userLoggedOut } from '../../actions';
import * as Yup from 'yup';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const LoginPage = () => {
    const { auth, authDispatch } = useContext(AppContext);
    const [authError, setAuthError] = useState(null);
    let history = useHistory();

    useEffect(() => {
        authDispatch(userLoggedOut());
        localStorage.removeItem('authToken');
    }, [authDispatch]);

    const onSubmit = async(values) => {
        try {
            const res = await axios.post('/auth/login', values);
            const token = res.data.token;
            localStorage.setItem('authToken', token);
            const decoded = jwtDecode(token);
            authDispatch(userLoggedIn({
                id: decoded.userId,
                name: decoded.userName,
                isAdmin: decoded.isAdmin
            }));
        } catch (error) {
            setAuthError(error);
        }
    }

    if (auth.info) {
        return <Redirect to="/" />;
    }

    return (
        <section className="hero is-fullheight" style={{minHeight: '100vh', height: '100vh', overflow: 'hidden'}}>
            <div className="hero-body" style={{display: 'flex', alignItems: 'center'}}>
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            <div className="box has-text-centered" style={{padding: '2rem', maxWidth: '400px', margin: '0 auto'}}>
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
                                        <div className="field" style={{marginBottom: '1rem'}}>
                                            <label className="label" htmlFor="username">Username</label>
                                            <div className="control has-icons-left">
                                                <Field name="username" type="text" className="input" data-testid="name" autoFocus placeholder="Enter your username" />
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-user"></i>
                                                </span>
                                            </div>
                                            <p className="help is-danger" data-testid="nameErrors">
                                                <ErrorMessage name="username" />
                                            </p>
                                        </div>

                                        <div className="field" style={{marginBottom: '1rem'}}>
                                            <label className="label" htmlFor="password">Password</label>
                                            <div className="control has-icons-left">
                                                <Field name="password" type="password" className="input" data-testid="password" placeholder="Enter your password" />
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-lock"></i>
                                                </span>
                                            </div>
                                            <p className="help is-danger" data-testid="passwordErrors">
                                                <ErrorMessage name="password" />
                                            </p>
                                        </div>
                                        <div className="field mt-5">
                                            <button className="button is-primary is-fullwidth is-medium" type="submit" data-testid="submit">
                                                <span className="icon">
                                                    <i className="fas fa-sign-in-alt"></i>
                                                </span>
                                                <span>Log In</span>
                                            </button>
                                            {authError ? (
                                                <div className="notification is-danger is-light mt-3 mb-0">
                                                    <button className="delete" onClick={() => setAuthError(null)}></button>
                                                    <p data-testid="authError">{authError.response?.data || authError.message || 'Login failed'}</p>
                                                </div>
                                            ) : null}
                                        </div>
                                    </Form>
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
