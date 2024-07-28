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
    <Formik
      enableReinitialize={true}
      initialValues={pageState}
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
          <div className="control">
            <Field name="name" type="text" data-testid="name" autoFocus />
          </div>
          <p className="help is-danger" data-testid="nameErrors">
            <ErrorMessage name="name" />
          </p>
        </div>
        <div className="field">
          <label className="label" htmlFor="description">
            Description
          </label>
          <div className="control">
            <Field name="description" type="text" data-testid="description" autoFocus />
          </div>
          <p className="help is-danger" data-testid="descriptionErrors">
            <ErrorMessage name="description" />
          </p>
        </div>
        <div className="field">
          <label className="label" htmlFor="isFavourite">
            Is Favourite Category
          </label>
          <div className="control">
            <Field name="isFavourite" type="checkbox" data-testid="isFavourite" />
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button className="button" data-testid="submit" type="submit">
              {props.category?.id > 0 ? "SAVE" : "CREATE"}
            </button>
          </div>
          <div className="control">
            <button className="button" data-testid="cancel" type="button" onClick={() => history.push("/categories")}>
              CANCEL
            </button>
          </div>
        </div>
      </Form>
    </Formik>
  );
};
