import React from "react";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { Category } from "../../../domain";
import { CategoryForm } from "./CategoryForm";

export const NewCategoryPage = () => {
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb
          items={[
            { url: "/categories", text: "Categories" },
            { url: "/categories/new", text: "New" },
          ]}
        />
        <div className="max-w-600 mx-auto">
          <h1 className="title is-3 mb-5">New Category</h1>
          <CategoryForm category={Category.createEmpty()} />
        </div>
      </div>
    </section>
  );
};
