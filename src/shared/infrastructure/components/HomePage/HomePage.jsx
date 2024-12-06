import React, { useEffect, useState, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../contexts";
import { GetCategoriesUseCase } from "../../../../lists/application";

export const HomePage = () => {
  const [categories, setCategories] = useState();
  const { auth } = useContext(AppContext);
  const { useCaseFactory } = useContext(AppContext);
  let history = useHistory();

  const getCategories = useCallback(async () => {
    const useCase = useCaseFactory.get(GetCategoriesUseCase);
    const data = await useCase.execute();

    setCategories(data);
  }, [useCaseFactory]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <div className="container">
      <h3 className="title">HOME</h3>
      {auth.info?.isAdmin && (
        <div className="box">
          <h6 className="subtitle is-6">Admin</h6>
          <div className="buttons">
            <button className="button is-small" onClick={() => history.push("/users")} data-testid="users">
              Users
            </button>
            <button className="button is-small" onClick={() => history.push("/refreshtokens")} data-testid="refreshTokens">
              Refresh Tokens
            </button>
            <button className="button is-small" onClick={() => history.push("/index-all-lists")} data-testid="indexLists">
              Index All Lists
            </button>
          </div>
        </div>
      )}
      <div className="box">
        <h6 className="subtitle is-6">Lists</h6>
        <div className="buttons">
          <button className="button is-small" onClick={() => history.push("/lists")} data-testid="lists">
            Lists
          </button>
          <button className="button is-small" onClick={() => history.push("/categories")} data-testid="categories">
            Categories
          </button>
        </div>
        <div className="buttons">
          {categories &&
            categories.length > 0 &&
            categories.map((category) => (
              <button key={category.id} className="button is-small" onClick={() => history.push(`/categories/${category.id}/lists`)} data-testid={`category${category.id}`}>
                {`${category.name}`}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
