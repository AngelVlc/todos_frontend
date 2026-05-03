import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { CategoryForm } from "./CategoryForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetCategoryByIdUseCase } from "../../../application";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";

export const EditCategoryPage = () => {
  let { categoryId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setPageState] = useState();

  const getExistingCategory = useCallback(async () => {
    const getCategoryByIdUseCase = useCaseFactory.get(GetCategoryByIdUseCase);
    const category = await getCategoryByIdUseCase.execute(categoryId);

    setPageState(category);
  }, [categoryId, useCaseFactory]);

  useEffect(() => {
    getExistingCategory();
  }, [categoryId, getExistingCategory]);

  return (
    <section className="section">
      {pageState && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/categories", text: "Categories" },
              {
                url: `/categories/${categoryId}`,
                text: pageState.name,
              },
            ]}
          />
          <div className="max-w-600 mx-auto">
            <h1 className="title is-3 mb-5">{`Edit category '${pageState.name}'`}</h1>
            <CategoryForm category={pageState} />
          </div>
        </div>
      )}
    </section>
  );
};
