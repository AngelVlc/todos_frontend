import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { UserForm } from "../UserForm";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetUserByIdUseCase } from "../../../application/users";

export const EditUserPage = () => {
  let { userId } = useParams();
  const { useCaseFactory } = useContext(AppContext);
  const [pageState, setUser] = useState();

  const getUser = useCallback(async () => {
    const getUserByIdUseCase = useCaseFactory.get(GetUserByIdUseCase);
    const data = await getUserByIdUseCase.execute(userId);

    setUser(data);
  }, [userId, useCaseFactory]);

  useEffect(() => {
    getUser();
  }, [userId, getUser]);

  return (
    <section className="section">
      {pageState && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/users", text: "Users" },
              { url: `/users/${userId}`, text: pageState.name },
            ]}
          />
          <div className="max-w-600 mx-auto">
            <h1 className="title is-3 mb-5">{`Edit user '${pageState.name}'`}</h1>
            <UserForm user={pageState} />
          </div>
        </div>
      )}
    </section>
  );
};
