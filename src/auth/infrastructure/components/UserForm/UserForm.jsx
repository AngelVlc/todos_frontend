import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import * as Yup from "yup";
import { CreateUserUseCase } from "../../../application/users/CreateUserUseCase";
import { UpdateUserUseCase } from "../../../application/users/UpdateUserUseCase";

export const UserForm = (props) => {
  let history = useHistory();
  const { useCaseFactory } = useContext(AppContext);

  const [pageState] = useState(props.user);

  const onSubmit = async (user) => {
    let useCase;
    if (props.user?.id === undefined) {
      useCase = useCaseFactory.get(CreateUserUseCase);
    } else {
      useCase = useCaseFactory.get(UpdateUserUseCase);
    }
    const result = await useCase.execute(user);
    if (result) {
      history.push("/users");
    }
  };

  return (
    <div className="card is-shadowless">
      <div className="card-content">
        <Formik
          enableReinitialize={true}
          initialValues={pageState}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={Yup.object({
            name: Yup.string().required("Required"),
          })}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="field">
              <label className="label" htmlFor="name">
                Name
              </label>
              <div className="control has-icons-left">
                <Field name="name" type="text" className="input" data-testid="name" autoFocus placeholder="Enter username" />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
              <p className="help is-danger" data-testid="nameErrors">
                <ErrorMessage name="name" />
              </p>
            </div>

            <div className="field">
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="control has-icons-left">
                <Field name="password" type="password" className="input" data-testid="password" placeholder="Enter password" />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="control has-icons-left">
                <Field
                  name="confirmPassword"
                  type="password"
                  className="input"
                  data-testid="confirmPassword"
                  placeholder="Confirm password"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="isAdmin">
                Is Admin
              </label>
              <div className="control">
                <label className="checkbox">
                  <Field name="isAdmin" type="checkbox" data-testid="isAdmin" />
                  <span className="ml-2">User has admin privileges</span>
                </label>
              </div>
            </div>

            <div className="field is-grouped is-grouped-right mt-6">
              <div className="control">
                <button className="button is-light" data-testid="cancel" type="button" onClick={() => history.push("/users")}>
                  Cancel
                </button>
              </div>
              {props.children}
              <div className="control">
                <button className="button is-info" data-testid="submit" type="submit">
                  <span className="icon">
                    <i className="fas fa-save"></i>
                  </span>
                  <span>{props.user?.id ? "Update User" : "Create User"}</span>
                </button>
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};
