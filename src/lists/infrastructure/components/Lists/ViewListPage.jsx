import React, { useEffect, useState, useContext, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListByIdUseCase, GetCategoriesUseCase } from "../../../application";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";

export const ViewListPage = () => {
  let history = useHistory();
  let { listId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState();

  const getExistingList = useCallback(async () => {
    const getCategoriesUseCase = useCaseFactory.get(GetCategoriesUseCase);
    const categories = await getCategoriesUseCase.execute();

    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const list = await getListByIdUseCase.execute(listId);

    const category = categories.find((c) => c.id === list.categoryId);

    if (category) {
      list.categoryName = category.name;
    }

    setPageState(list);
  }, [listId, useCaseFactory]);

  useEffect(() => {
    getExistingList();
  }, [listId, getExistingList]);

  return (
    <section className="section">
      {pageState && (
        <div className="container">
          <div className="max-w-800 mx-auto">
            <Breadcrumb
              items={[
                { url: "/lists", text: "Lists" },
                { url: `/lists/${listId}`, text: pageState.name },
              ]}
            />
            <div className="card">
              <div className="card-content">
                <div className="level is-mobile mb-4">
                  <div className="level-left">
                    <h1 className="title is-3 mb-0">
                      <span className="icon mr-2 has-text-primary">
                        <i className="fas fa-clipboard-list"></i>
                      </span>
                      {pageState.name}
                    </h1>
                  </div>
                  <div className="level-right">
                    <button
                      className="button is-primary"
                      data-testid="edit"
                      onClick={() => history.push(`/lists/${listId}`)}
                    >
                      <span className="icon">
                        <i className="fas fa-edit"></i>
                      </span>
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
                
                {pageState.categoryName && (
                  <div className="mb-5">
                    <span className="tag is-info is-medium">
                      <span className="icon is-small">
                        <i className="fas fa-tags"></i>
                      </span>
                      <span>{pageState.categoryName}</span>
                    </span>
                  </div>
                )}

                <div className="content">
                  <h2 className="title is-5 mb-4">
                    <span className="icon mr-2 has-text-grey">
                      <i className="fas fa-list-ul"></i>
                    </span>
                    Items ({pageState.items.length})
                  </h2>
                  {pageState.items.length > 0 ? (
                    <div className="timeline">
                      {pageState.items.map((item, index) => (
                        <article className="media mb-3" key={item.id}>
                          <div className="media-left">
                            <span className="icon is-medium has-text-primary">
                              <i className="fas fa-circle fa-xs"></i>
                            </span>
                          </div>
                          <div className="media-content">
                            <h5 className="is-size-5 has-text-weight-semibold">{item.title}</h5>
                            {item.description && (
                              <pre className="is-size-7 mt-1 has-background-light p-2">{item.description}</pre>
                            )}
                          </div>
                          <div className="media-right">
                            <span className="tag is-light">#{index + 1}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="has-text-centered py-6 has-text-grey">
                      <span className="icon is-large">
                        <i className="fas fa-clipboard-list fa-3x"></i>
                      </span>
                      <p className="mt-3">This list is empty. Edit it to add items!</p>
                    </div>
                  )}
                </div>

                <div className="field is-grouped is-grouped-right mt-6">
                  <div className="control">
                    <button
                      className="button is-light"
                      data-testid="cancel"
                      type="button"
                      onClick={() => history.push("/lists")}
                    >
                      Back to Lists
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
