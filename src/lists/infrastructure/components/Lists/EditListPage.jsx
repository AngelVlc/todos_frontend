import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ListForm } from "./ListForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetListByIdUseCase } from "../../../application";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";

export const EditListPage = () => {
  let history = useHistory();
  let { listId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState();

  const getExistingList = useCallback(async () => {
    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const list = await getListByIdUseCase.execute(listId);

    setPageState(list);
  }, [listId, useCaseFactory]);

  useEffect(() => {
    getExistingList();
  }, [listId, getExistingList]);

  return (
    <section className="section">
      {pageState && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/lists", text: "Lists" },
              {
                url: `/lists/${listId}`,
                text: pageState.name,
              },
            ]}
          />
          <div className="max-w-800 mx-auto">
            <h1 className="title is-3 mb-5">{`Edit list '${pageState.name}'`}</h1>
            <ListForm
              list={pageState}
              preCancel={
                <div className="control">
                  <button
                    className="button is-info is-light"
                    data-testid="read"
                    type="button"
                    onClick={() => history.push(`/lists/${listId}/read`)}
                  >
                    <span className="icon">
                      <i className="fas fa-eye"></i>
                    </span>
                    <span>View</span>
                  </button>
                </div>
              }
            />
          </div>
        </div>
      )}
    </section>
  );
};
