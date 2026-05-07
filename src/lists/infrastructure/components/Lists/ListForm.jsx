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
            .max(50, "List name cannot exceed 50 characters"),
        })}
        onSubmit={onSubmit}
      >
            <Form>
              <div className="field">
                <label className="label" htmlFor="name">
                  Name
                </label>
                <div className="control has-icons-left">
                  <Field name="name" as="input" className="input" data-testid="name" autoFocus placeholder="Enter list name" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-list"></i>
                  </span>
                </div>
                <p className="help is-danger" data-testid="nameErrors">
                  <ErrorMessage name="name" />
                </p>
              </div>
              <div className="field">
                <label className="label" htmlFor="categoryId">
                  Category
                </label>
                <div className="control has-icons-left">
                  <Field name="categoryId" as="select" className="input" data-testid="categoryId">
                    <option value="">Select a category</option>
                    {categories &&
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </Field>
                  <span className="icon is-small is-left">
                    <i className="fas fa-tags"></i>
                  </span>
                </div>
                <p className="help is-danger" data-testid="categoryIdErrors">
                  <ErrorMessage name="categoryId" />
                </p>
              </div>
              <div className="mt-6">
                <div className="level is-mobile mb-3">
                  <div className="level-left">
                    <span className="title is-5">
                      <span className="icon mr-1 has-text-primary">
                        <i className="fas fa-clipboard-list"></i>
                      </span>
                      List Items
                    </span>
                  </div>
                  <div className="level-right">
                    <button className="button is-primary is-small" type="button" data-testid="addNew" onClick={() => onAddNewItem()}>
                      <span className="icon is-small">
                        <i className="fas fa-plus"></i>
                      </span>
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="dnd-container">
                    <Droppable droppableId={props.list.id.toString()}>
                      {(provided) => (
                        <div className="dnd-list" ref={provided.innerRef} {...provided.droppableProps}>
                          {pageState.items.length > 0 ? (
                            pageState.items.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                {(draggableProvided) => (
                                  <div
                                    key={item.id}
                                    className="card mb-2 p-3"
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                    ref={draggableProvided.innerRef}
                                    data-testid={`draggable${item.id}`}
                                  >
                                    <div className="is-flex is-align-items-center">
                                      <div className="is-flex-grow-4" data-testid={`editListItem${item.id}`} onClick={() => onEditItem(item)} style={{cursor: 'pointer'}}>
                                        <span className="has-text-weight-semibold">{item.title}</span>
                                        {item.description && (
                                          <p className="is-size-7 has-text-grey mt-1">{item.description}</p>
                                        )}
                                      </div>
                                      <div className="is-flex is-align-items-center">
                                        <button 
                                          type="button" 
                                          className="button is-small is-info is-light mr-2"
                                          data-testid={`moveListItem${item.id}`}
                                          onClick={() => history.push(`/lists/${props.list.id}/moveItem/${item.id}`)}
                                        >
                                          <span className="icon is-small">
                                            <i className="fas fa-dolly"></i>
                                          </span>
                                        </button>
                                        <button 
                                          type="button" 
                                          className="button is-small is-danger is-light" 
                                          data-testid={`deleteListItem${item.id}`} 
                                          onClick={() => onDeleteListItem(item)}
                                        >
                                          <span className="icon is-small">
                                            <i className="fas fa-trash"></i>
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div className="has-text-centered py-4 has-text-grey">
                              <span className="icon is-medium">
                                <i className="fas fa-clipboard-list fa-2x"></i>
                              </span>
                              <p className="mt-2">No items yet. Click "Add Item" to create one!</p>
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </DragDropContext>
              </div>
              <div className="field is-grouped is-grouped-right mt-6">
                <div className="control">
                  <button className="button is-light" data-testid="cancel" type="button" onClick={() => history.push("/lists")}>
                    Cancel
                  </button>
                </div>
                <>{props.preCancel}</>
                <div className="control">
                  <button className="button is-primary" data-testid="submit" type="submit">
                    <span className="icon">
                      <i className="fas fa-save"></i>
                    </span>
                    <span>{props.list?.id > 0 ? "Save Changes" : "Create List"}</span>
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};
