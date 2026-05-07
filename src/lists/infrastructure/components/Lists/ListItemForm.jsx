import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ListItem } from "../../../domain";
import * as Yup from "yup";

export const ListItemForm = forwardRef((props, ref) => {
  const formRef = useRef();
  const titleField = useRef();

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      await formRef.current.submitForm();
    },
    setValues: (values) => {
      formRef.current.setValues(values, false);
    },
    setFocus: () => {
      titleField.current.focus();
    }
  }));

  return (
    <Formik
      innerRef={formRef}
      initialValues={ListItem.createEmpty(-1)}
      enableReinitialize={true}
      validationSchema={Yup.object({
        title: Yup.string()
          .required("Required")
          .max(50, "Title cannot exceed 50 characters"),
        description: Yup.string()
          .max(500, "Description cannot exceed 500 characters"),
      })}
      onSubmit={props.onSubmit}
    >
      <Form>
        <div className="field">
          <label className="label" htmlFor="title">
            Title
          </label>
          <div className="control">
            <Field
              name="title"
              as="input"
              className="input"
              data-testid="title"
              innerRef={titleField}
            />
          </div>
          <p className="help is-danger" data-testid="titleErrors">
            <ErrorMessage name="title" />
          </p>
        </div>
        <div className="field">
          <label className="label" htmlFor="description">
            Description
          </label>
          <div className="control">
            <Field
              name="description"
              as="textarea"
              className="textarea"
              data-testid="description"
            />
          </div>
          <p className="help is-danger" data-testid="descriptionErrors">
            <ErrorMessage name="description" />
          </p>
        </div>
      </Form>
    </Formik>
  );
});
