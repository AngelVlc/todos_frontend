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
    <section className="section">
      {categories !== undefined && (
        <div className="container">
          <Breadcrumb items={[{ url: "/categories", text: "Categories" }]} />
          <div className="level is-mobile mb-4">
            <div className="level-left">
              <h1 className="title is-3 mb-0">Categories</h1>
            </div>
            <div className="level-right">
              <button
                className="button is-primary"
                data-testid="addNew"
                onClick={() => onNewClick()}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>New Category</span>
              </button>
            </div>
          </div>
          
          {categories.length > 0 ? (
            <div className="table-container">
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="has-text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      className="is-clickable"
                      key={category.id}
                      onClick={() => history.push(`/categories/${category.id}`)}
                      data-testid={`viewCategory${category.id}`}
                    >
                      <td className="has-text-weight-semibold">{category.name}</td>
                      <td className="has-text-right" onClick={(e) => e.stopPropagation()}>
                        <Link
                          className="button is-small is-danger is-light"
                          data-testid={`deleteCategory${category.id}`}
                          to={`/categories/${category.id}/delete`}
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
                <i className="fas fa-tags fa-3x"></i>
              </span>
              <p className="mt-4 mb-4">No categories found. Create your first one!</p>
              <button
                className="button is-primary"
                onClick={() => onNewClick()}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Create Category</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
