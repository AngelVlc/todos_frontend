import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import {
  GetCategoryByIdUseCase,
  DeleteCategoryByIdUseCase,
} from "../../../application";

export const DeleteCategoryPage = () => {
  const [category, setCategory] = useState();
  const { useCaseFactory } = useContext(AppContext);
  let { categoryId } = useParams();
  let history = useHistory();

  const getCategory = useCallback(async () => {
    const getCategoryByIdUseCase = useCaseFactory.get(GetCategoryByIdUseCase);
    const category = await getCategoryByIdUseCase.execute(categoryId);

    setCategory(category);
  }, [categoryId, useCaseFactory]);

  useEffect(() => {
    getCategory();
  }, [categoryId, getCategory]);

  const deleteCategory = async () => {
    const deleteCategoryByIdUseCase = useCaseFactory.get(DeleteCategoryByIdUseCase);

    if (await deleteCategoryByIdUseCase.execute(categoryId)) {
      history.push("/categories");
    }
  };

  return (
    <>
      {category && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/categories", text: "Categories" },
              { url: `/categories/${categoryId}/delete`, text: 'Delete' },
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
                    {`Delete category "${category.name}"?`}
                  </h3>
                  <p className="has-text-centered mb-5">
                    This action cannot be undone. Lists using this category will be affected.
                  </p>
                  <div className="field is-grouped is-grouped-centered">
                    <div className="control">
                      <button 
                        className="button is-light" 
                        data-testid="no"
                        onClick={() => history.push('/categories')}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="control">
                      <button 
                        className="button is-danger" 
                        data-testid="yes"
                        onClick={deleteCategory}
                      >
                        <span className="icon is-small">
                          <i className="fas fa-trash"></i>
                        </span>
                        <span>Delete Category</span>
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
