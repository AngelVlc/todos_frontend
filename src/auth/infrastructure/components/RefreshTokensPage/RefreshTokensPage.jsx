import React, { useEffect, useState, useContext, useCallback } from "react";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { TableWithSelectors } from "../../../../shared/infrastructure/components/TableWithSelectors/TableWithSelectors";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import {
  GetRefreshTokensUseCase,
  DeleteSelectedRefreshTokensUseCase,
} from "../../../application/refreshTokens";

export const RefreshTokensPage = () => {
  const [tokens, setTokens] = useState();
  const { useCaseFactory } = useContext(AppContext);
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 1,
    pageSize: 10,
    sortColumn: "id",
    sortOrder: "desc",
  });

  const getRefreshTokens = useCallback(async () => {
    const getRefreshTokensUseCase = useCaseFactory.get(GetRefreshTokensUseCase);
    const refreshTokens = await getRefreshTokensUseCase.execute(pageInfo);

    setTokens(refreshTokens);
  }, [useCaseFactory, pageInfo]);

  useEffect(() => {
    getRefreshTokens();
  }, [getRefreshTokens]);

  const onDeleteSelectedTokens = async () => {
    const deleteSelectedRefreshTokensUseCase = useCaseFactory.get(
      DeleteSelectedRefreshTokensUseCase
    );
    const ok = await deleteSelectedRefreshTokensUseCase.execute(tokens);
    if (ok) {
      getRefreshTokens();
    }
  };

  return (
    <section className="section">
      {tokens && (
        <div className="container">
          <Breadcrumb
            items={[{ url: "/refreshtokens", text: "Refresh Tokens" }]}
          />
          <div className="level is-mobile mb-4">
            <div className="level-left">
              <h1 className="title is-3 mb-0">Refresh Tokens</h1>
            </div>
            <div className="level-right">
              <button
                className="button is-danger is-light"
                data-testid="deleteSelected"
                onClick={() => onDeleteSelectedTokens()}
              >
                <span className="icon">
                  <i className="fas fa-trash-alt"></i>
                </span>
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
          <TableWithSelectors
            columns={[
              { name: "id", title: "ID" },
              { name: "userId", title: "User ID" },
              { name: "expirationDate", title: "Expiration Date" },
            ]}
            rows={tokens}
            idColumnName={"id"}
            selectedColumnName={"selected"}
            paginationInfo={pageInfo}
            changeSelected={setTokens}
            changePagination={setPageInfo}
          />
        </div>
      )}
    </section>
  );
};
