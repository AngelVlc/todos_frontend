import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import {
  GetListByIdUseCase,
  DeleteListByIdUseCase,
} from "../../../application";

export const DeleteListPage = () => {
  const [list, setList] = useState();
  const { useCaseFactory } = useContext(AppContext);
  let { listId } = useParams();
  let history = useHistory();

  const getList = useCallback(async () => {
    const getListByIdUseCase = useCaseFactory.get(GetListByIdUseCase);
    const list = await getListByIdUseCase.execute(listId);

    setList(list);
  }, [listId, useCaseFactory]);

  useEffect(() => {
    getList();
  }, [listId, getList]);

  const deleteList = async () => {
    const deleteListByIdUseCase = useCaseFactory.get(DeleteListByIdUseCase);

    if (await deleteListByIdUseCase.execute(listId)) {
      history.push("/lists");
    }
  };

  return (
    <>
      {list && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/lists", text: "Lists" },
              { url: `/lists/${listId}/delete`, text: 'Delete' },
            ]}
          />
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="card is-shadowless">
                <div className="card-content">
                  <div className="has-text-centered mb-4">
                    <span className="icon is-medium has-text-danger">
                      <i className="fas fa-trash fa-3x"></i>
                    </span>
                  </div>
                  <h3 className="title is-4 has-text-centered">
                    {`Delete list "${list.name}"?`}
                  </h3>
                  <p className="has-text-centered mb-5">
                    This action cannot be undone. All items in this list will be permanently deleted.
                  </p>
                  <div className="field is-grouped is-grouped-centered">
                    <div className="control">
                      <button 
                        className="button is-light" 
                        data-testid="no"
                        onClick={() => history.push('/lists')}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="control">
                      <button 
                        className="button is-danger" 
                        data-testid="yes"
                        onClick={deleteList}
                      >
                        <span className="icon is-small">
                          <i className="fas fa-trash"></i>
                        </span>
                        <span>Delete List</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
