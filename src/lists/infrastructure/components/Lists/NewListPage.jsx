import React from "react";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { List } from "../../../domain";
import { ListForm } from "./ListForm";

export const NewListPage = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="max-w-800 mx-auto">
          <Breadcrumb
            items={[
              { url: "/lists", text: "Lists" },
              { url: "/lists/new", text: "New" },
            ]}
          />
          <h1 className="title is-3 mb-5">New List</h1>
          <ListForm list={List.createEmpty()} />
        </div>
      </div>
    </section>
  );
};
