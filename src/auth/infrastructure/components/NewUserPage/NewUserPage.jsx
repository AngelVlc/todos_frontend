import React from "react";
import { UserForm } from "../UserForm";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { User } from "../../../domain";

export const NewUserPage = () => {
  return (
    <section className="section">
      <div className="container">
        <Breadcrumb
          items={[
            { url: "/users", text: "Users" },
            { url: "/users/new", text: "New" },
          ]}
        />
        <div className="max-w-600 mx-auto">
          <h1 className="title is-3 mb-5">New User</h1>
          <UserForm user={User.createEmpty()} />
        </div>
      </div>
    </section>
  );
};
