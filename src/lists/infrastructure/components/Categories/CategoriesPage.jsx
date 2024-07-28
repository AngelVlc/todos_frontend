import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetCategoriesUseCase } from "../../../application";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState();
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

  const onNewClick = () => {
    history.push("/categories/new");
  };

  return (
    <>
      {categories && (
        <div className="container">
          <Breadcrumb items={[{ url: "/categories", text: "Categories" }]} />
          <h3 className="title">CATEGORIES</h3>
          <table className="table">
            <thead>
              <tr>
                <td>Name</td>
                <td>Is Favourite</td>
                <td>
                  <button
                    className="button is-small"
                    data-testid="addNew"
                    onClick={() => onNewClick()}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-plus"></i>
                    </span>
                  </button>
                </td>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 &&
                categories.map((category) => (
                  <tr
                    className="is-clickable"
                    key={category.id}
                    onClick={() => history.push(`/categories/${category.id}`)}
                    data-testid={`viewCategory${category.id}`}
                  >
                    <td>{category.name}</td>
                    <td>
                      {category.isFavourite && (
                        <center>
                          <span className="icon is-small">
                            <i className="fas fa-check fa-xs"></i>
                          </span>
                        </center>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <center>
                        <Link
                          className="has-text-black delete"
                          data-testid={`deleteCategory${category.id}`}
                          to={`/categories/${category.id}/delete`}
                        ></Link>
                      </center>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
