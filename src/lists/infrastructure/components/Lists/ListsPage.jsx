import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListsUseCase, GetSearchSecureKeyUseCase, GetCategoriesUseCase } from "../../../application";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { Modal } from "../../../../shared/infrastructure/components/Modal";
import { SearchListsComponent } from "../ListsSearch";

export const ListsPage = () => {
  const [lists, setLists] = useState();
  const [searchSecureKey, setSearchSecureKey] = useState();
  const { useCaseFactory } = useContext(AppContext);
  let history = useHistory();
  const searchListRef = useRef();

  const getLists = useCallback(async () => {
    const getListsUseCase = useCaseFactory.get(GetListsUseCase);
    const data = await getListsUseCase.execute();

    const getCategoriesUseCase = useCaseFactory.get(GetCategoriesUseCase);
    const categories = await getCategoriesUseCase.execute();

    const lists = data.map((list) => {
      const category = categories.find((c) => c.id === list.categoryId);

      if (category) {
        list.categoryName = category.name;
      }

      return list;
    });

    setLists(lists);
  }, [useCaseFactory]);

  const getSearchSecureKey = useCallback(async () => {
    const getSearchSecureKeyUseCase = useCaseFactory.get(
      GetSearchSecureKeyUseCase
    );
    const key = await getSearchSecureKeyUseCase.execute();

    setSearchSecureKey(key);
  }, [useCaseFactory]);

  useEffect(() => {
    getLists();
  }, [getLists]);

  useEffect(() => {
    getSearchSecureKey();
  }, [getSearchSecureKey]);

  const onNewClick = () => {
    history.push("/lists/new");
  };

  const onSearchClick = () => {
    searchListRef.current.showModal();
  }

  return (
    <section className="section">
      <Modal ref={searchListRef} showOk={false}>
        <SearchListsComponent searchSecureKey={searchSecureKey} />
      </Modal>
      {lists !== undefined && (
        <div className="container">
          <Breadcrumb items={[{ url: "/lists", text: "Lists" }]} />
          <div className="level is-mobile mb-4">
            <div className="level-left">
              <h1 className="title is-3 mb-0">Lists</h1>
            </div>
            <div className="level-right">
              <div className="field is-grouped">
                <div className="control">
                  <button
                    className="button is-info is-light"
                    data-testid="search"
                    onClick={() => onSearchClick()}
                  >
                    <span className="icon">
                      <i className="fas fa-search"></i>
                    </span>
                    <span>Search</span>
                  </button>
                </div>
                <div className="control">
                  <button
                    className="button is-primary"
                    data-testid="addNew"
                    onClick={() => onNewClick()}
                  >
                    <span className="icon">
                      <i className="fas fa-plus"></i>
                    </span>
                    <span>New List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {lists.length > 0 ? (
            <div className="table-container">
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th className="has-text-centered"># Items</th>
                    <th className="has-text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lists.map((list) => (
                    <tr
                      className="is-clickable"
                      key={list.id}
                      onClick={() => history.push(`/lists/${list.id}`)}
                      data-testid={`viewList${list.id}`}
                    >
                      <td className="has-text-weight-semibold">{list.name}</td>
                      <td>{list.categoryName || '-'}</td>
                      <td className="has-text-centered">
                        <span className="tag is-light is-info">{list.itemsCount}</span>
                      </td>
                      <td className="has-text-right" onClick={(e) => e.stopPropagation()}>
                        <Link
                          className="button is-small is-danger is-light"
                          data-testid={`deleteList${list.id}`}
                          to={`/lists/${list.id}/delete`}
                        >
                          <span className="icon is-small">
                            <i className="fas fa-trash"></i>
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="has-text-centered py-6">
              <span className="icon is-large has-text-grey-light">
                <i className="fas fa-inbox fa-3x"></i>
              </span>
              <p className="mt-4 mb-4">No lists found. Create your first one!</p>
              <button
                className="button is-primary"
                onClick={() => onNewClick()}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Create List</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
