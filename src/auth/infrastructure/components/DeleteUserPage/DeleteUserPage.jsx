import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import {
  GetUserByIdUseCase,
  DeleteUserByIdUseCase,
} from "../../../application/users";

export const DeleteUserPage = () => {
  const [user, setUser] = useState();
  const { useCaseFactory } = useContext(AppContext);
  let { userId } = useParams();
  let history = useHistory();

  const getUser = useCallback(async () => {
    const getUserByIdUseCase = useCaseFactory.get(GetUserByIdUseCase);
    const user = await getUserByIdUseCase.execute(userId);

    setUser(user);
  }, [userId, useCaseFactory]);

  useEffect(() => {
    getUser();
  }, [userId, getUser]);

  const deleteUser = async () => {
    const deleteUserByIdUseCase = useCaseFactory.get(DeleteUserByIdUseCase);

    if (await deleteUserByIdUseCase.execute(userId)) {
      history.push("/users");
    }
  };

  return (
    <>
      {user && (
        <div className="container">
          <Breadcrumb
            items={[
              { url: "/users", text: "Users" },
              { url: `/users/${userId}/delete`, text: `Delete ${user.name}` },
            ]}
          />
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="card is-shadowless">
                <div className="card-content">
                  <div className="has-text-centered mb-4">
                    <span className="icon is-medium has-text-danger">
                      <i className="fas fa-user-times fa-3x"></i>
                    </span>
                  </div>
                  <h3 className="title is-4 has-text-centered">
                    {user.isAdmin
                      ? `Delete admin user "${user.name}"?`
                      : `Delete user "${user.name}"?`}
                  </h3>
                  <p className="has-text-centered mb-5">
                    This action cannot be undone. The user will be permanently removed from the system.
                  </p>
                  <div className="field is-grouped is-grouped-centered">
                    <div className="control">
                      <button 
                        className="button is-light" 
                        data-testid="no"
                        onClick={() => history.push('/users')}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="control">
                      <button 
                        className="button is-danger" 
                        data-testid="yes"
                        onClick={deleteUser}
                      >
                        <span className="icon is-small">
                          <i className="fas fa-user-times"></i>
                        </span>
                        <span>Delete User</span>
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
