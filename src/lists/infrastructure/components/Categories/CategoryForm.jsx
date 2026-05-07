import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import * as Yup from "yup";
import { CreateCategoryUseCase, UpdateCategoryUseCase } from "../../../application";

export const CategoryForm = (props) => {
  let history = useHistory();
  const { useCaseFactory } = useContext(AppContext);

  const [pageState] = useState(props.category);

  const onSubmit = async (category) => {
    let useCase;

    if (props.category?.id === -1) {
      useCase = useCaseFactory.get(CreateCategoryUseCase);
    } else {
      useCase = useCaseFactory.get(UpdateCategoryUseCase);
    }

    const result = await useCase.execute(category);
    if (result) {
      history.push("/categories");
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
        name: Yup.string()
          .required("Required")
          .max(12, "Category name cannot exceed 12 characters"),
      })}
      onSubmit={onSubmit}
    >
          <Form>
            <div className="field">
              <label className="label" htmlFor="name">
                Name
              </label>
              <div className="control has-icons-left">
                <Field name="name" type="text" className="input" data-testid="name" autoFocus placeholder="Enter category name" />
                <span className="icon is-small is-left">
                  <i className="fas fa-tag"></i>
                </span>
              </div>
              <p className="help is-danger" data-testid="nameErrors">
                <ErrorMessage name="name" />
              </p>
            </div>
            <div className="field">
              <label className="label" htmlFor="description">
                Description
              </label>
              <div className="control has-icons-left">
                <Field name="description" type="text" className="input" data-testid="description" placeholder="Enter description (optional)" />
                <span className="icon is-small is-left">
                  <i className="fas fa-align-left"></i>
                </span>
              </div>
              <p className="help is-danger" data-testid="descriptionErrors">
                <ErrorMessage name="description" />
              </p>
            </div>
            <div className="field is-grouped is-grouped-right mt-6">
              <div className="control">
                <button className="button is-light" data-testid="cancel" type="button" onClick={() => history.push("/categories")}>
                  Cancel
                </button>
              </div>
              <div className="control">
                <button className="button is-link" data-testid="submit" type="submit">
                  <span className="icon">
                    <i className="fas fa-save"></i>
                  </span>
                  <span>{props.category?.id > 0 ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};
