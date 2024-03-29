import React, { useState, useContext, useRef, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { List, ListItem } from "../../../domain";
import { CreateListUseCase, UpdateListUseCase, GetCategoriesUseCase } from "../../../application";
import { Modal } from "../../../../shared/infrastructure/components/Modal";
import { ListItemForm } from "./ListItemForm";
import * as Yup from "yup";
import "./ListForm.css";

export const ListForm = (props) => {
  let history = useHistory();
  const { useCaseFactory } = useContext(AppContext);
  const itemFormModalRef = useRef();
  const itemFormRef = useRef();
  const [categories, setCategories] = useState();

  const [pageState, setPageState] = useState(props.list);

  const getCategories = useCallback(async () => {
    const getCategoriesUseCase = useCaseFactory.get(GetCategoriesUseCase);
    const categories = await getCategoriesUseCase.execute();

    setCategories(categories);
  }, [useCaseFactory]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const onSubmit = async (list) => {
    if (list.categoryId !== undefined || list.categoryId !== null) {
      list.categoryId = parseInt(list.categoryId);
    } else {
      list.categoryId = null;
    }

    let useCase;

    if (props.list?.id === -1) {
      useCase = useCaseFactory.get(CreateListUseCase);
    } else {
      useCase = useCaseFactory.get(UpdateListUseCase);
    }

    const result = await useCase.execute(list);

    setPageState(list);

    if (result && props.list?.id === -1) {
      history.push(`/lists/${result.id}`);
    }
  };

  const onDragEnd = (dropResult) => {
    const { destination, source } = dropResult;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newItems = Array.from(pageState.items);
    newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, pageState.items[source.index]);

    const newList = new List({ ...pageState, items: newItems });

    setPageState(newList);
  };

  const onDeleteListItem = (item) => {
    const index = pageState.items.indexOf(item);
    const newItems = Array.from(pageState.items);
    newItems.splice(index, 1);

    const newList = new List({ ...pageState, items: newItems });

    setPageState(newList);
  };

  const onAddNewItem = () => {
    showItemModal(ListItem.createEmpty(props.list?.id));
  };

  const onEditItem = (item) => {
    showItemModal(item);
  };

  const showItemModal = (item) => {
    itemFormRef.current.setValues(item);
    itemFormModalRef.current.showModal();
    itemFormRef.current.setFocus();
  };

  const onSubmitItemForm = (listItem) => {
    const newList = new List({ ...pageState, items: pageState.items });

    if (listItem.id === -1) {
      newList.addNewItem(listItem);
    } else {
      for (const item of newList.items) {
        if (item.id === listItem.id) {
          item.title = listItem.title;
          item.description = listItem.description;
          item.listId = listItem.listId;

          break;
        }
      }
    }

    setPageState(newList);

    itemFormModalRef.current.closeModal();
  };

  const onItemModalClose = () => {
    itemFormRef.current.submitForm();
  };

  return (
    <>
      <Modal ref={itemFormModalRef} closeHandler={onItemModalClose} showOk={true}>
        <ListItemForm ref={itemFormRef} onSubmit={onSubmitItemForm} />
      </Modal>
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
              <Field name="name" as="input" className="input" data-testid="name" autoFocus />
            </div>
            <p className="help is-danger" data-testid="nameErrors">
              <ErrorMessage name="name" />
            </p>
          </div>
          <div className="field">
            <label className="label" htmlFor="categoryId">
              Category
            </label>
            <div className="control">
              <Field name="categoryId" as="select" className="input" data-testid="categoryId">
                <option value=""></option>
                {categories &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </Field>
            </div>
            <p className="help is-danger" data-testid="categoryIdErrors">
              <ErrorMessage name="categoryId" />
            </p>
          </div>
          <div>
            <div className="is-flex">
              <div className="is-flex-grow-4">
                <span className="label">List Items</span>
              </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="dnd-container">
                <div className="list-button mt-2 mb-2">
                  <button className="button is-small" type="button" data-testid="addNew" onClick={() => onAddNewItem()}>
                    <span className="icon is-small">
                      <i className="fas fa-plus"></i>
                    </span>
                    <span>Add</span>
                  </button>
                </div>
                <Droppable droppableId={props.list.id.toString()}>
                  {(provided) => (
                    <div className="dnd-list" ref={provided.innerRef} {...provided.droppableProps}>
                      {pageState.items.length > 0 &&
                        pageState.items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                            {(draggableProvided) => (
                              <div
                                key={item.id}
                                className="is-flex dnd-item p-2 mb-2"
                                {...draggableProvided.draggableProps}
                                {...draggableProvided.dragHandleProps}
                                ref={draggableProvided.innerRef}
                                data-testid={`draggable${item.id}`}
                              >
                                <div className="is-flex-grow-4" data-testid={`editListItem${item.id}`} onClick={() => onEditItem(item)}>
                                  <span className="has-text-black">{item.title}</span>
                                </div>
                                <div className="is-justify-content-flex-end">
                                  <center>
                                    <span className="icon is-clickable rounded-button" onClick={() => history.push(`/lists/${props.list.id}/moveItem/${item.id}`)}>
                                      <i className="fas fa-dolly fa-xs"></i>
                                    </span>
                                    <button type="button" className="delete ml-2" data-testid={`deleteListItem${item.id}`} onClick={() => onDeleteListItem(item)}></button>
                                  </center>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button className="button" data-testid="submit" type="submit">
                {props.list?.id > 0 ? "SAVE" : "CREATE"}
              </button>
            </div>
            <>{props.preCancel}</>
            <div className="control ml-auto is-pulled-right">
              <button className="button" data-testid="cancel" type="button" onClick={() => history.push("/lists")}>
                CANCEL
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
};
