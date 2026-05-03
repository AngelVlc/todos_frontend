import React, { useContext, useState } from "react";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { useHistory } from "react-router-dom";
import { IndexAllListsUseCase } from "../../../application";

export const IndexAllListsPage = () => {
  const { useCaseFactory } = useContext(AppContext);
  let history = useHistory();
  const [isIndexing, setIsIndexing] = useState(false);

  const indexAllDocs = async () => {
    setIsIndexing(true);
    const indexAllUseCase = useCaseFactory.get(IndexAllListsUseCase);

    if (await indexAllUseCase.execute()) {
      history.push("/");
    }
    setIsIndexing(false);
  };

  return (
    <section className="section">
      <div className="container">
        <Breadcrumb
          items={[{ url: "/index-all-lists", text: "Index All Lists" }]}
        />
        <div className="max-w-600 mx-auto">
          <div className="card is-shadowless">
            <div className="card-content">
              <div className="has-text-centered mb-6">
                <span className="icon is-large has-text-primary">
                  <i className="fas fa-database fa-3x"></i>
                </span>
                <h1 className="title is-3 mt-4">Index All Lists</h1>
                <p className="subtitle is-6 has-text-grey mt-2">
                  This will re-index all lists in the search engine
                </p>
              </div>
              
              {isIndexing ? (
                <div className="has-text-centered py-6">
                  <span className="icon is-medium">
                    <i className="fas fa-spinner fa-spin fa-2x"></i>
                  </span>
                  <p className="mt-4">Indexing in progress...</p>
                </div>
              ) : (
                <div className="field is-grouped is-grouped-centered mt-6">
                  <div className="control">
                    <button
                      className="button is-primary"
                      data-testid="yes"
                      onClick={indexAllDocs}
                    >
                      <span className="icon">
                        <i className="fas fa-sync-alt"></i>
                      </span>
                      <span>Start Indexing</span>
                    </button>
                  </div>
                  <div className="control">
                    <button
                      className="button is-light"
                      data-testid="no"
                      onClick={() => history.push("/")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
