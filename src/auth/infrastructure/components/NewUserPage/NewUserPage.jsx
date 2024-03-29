import React from "react";
import { UserForm } from "../UserForm";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { User } from "../../../domain";

export const NewUserPage = () => {
  return (
    <div className="container">
      <Breadcrumb
        items={[
          { url: "/users", text: "Users" },
          { url: "/users/new", text: "New" },
        ]}
      />
      <h3 className="title">New user</h3>
      <UserForm user={User.createEmpty()} />
    </div>
  );
};
