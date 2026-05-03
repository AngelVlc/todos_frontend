import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../../../../shared/infrastructure/contexts";
import { GetUsersUseCase } from "../../../application/users";
import { Breadcrumb } from "../../../../shared/infrastructure/components/Breadcrumb";

export const UsersPage = () => {
  const [users, setUsers] = useState();
  const { useCaseFactory } = useContext(AppContext);
  let history = useHistory();

  const getUsers = useCallback(async () => {
    const getUsersUseCase = useCaseFactory.get(GetUsersUseCase);
    const data = await getUsersUseCase.execute();

    setUsers(data);
  }, [useCaseFactory]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <section className="section">
      {users !== undefined && (
        <div className="container">
          <Breadcrumb items={[{ url: "/users", text: "Users" }]} />
          <div className="level is-mobile mb-4">
            <div className="level-left">
              <h1 className="title is-3 mb-0">Users</h1>
            </div>
            <div className="level-right">
              <button
                className="button is-primary"
                data-testid="addNew"
                onClick={() => history.push("users/new")}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Add User</span>
              </button>
            </div>
          </div>
          
          {users.length > 0 ? (
            <div className="table-container">
              <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th>User</th>
                    <th className="has-text-centered">Role</th>
                    <th className="has-text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      className="is-clickable"
                      key={user.id}
                      onClick={() => history.push(`/users/${user.id}/edit`)}
                      data-testid={`editUser${user.id}`}
                    >
                      <td className="has-text-weight-semibold">{user.name}</td>
                      <td className="has-text-centered">
                        {user.isAdmin ? (
                          <span className="tag is-info is-light">
                            <span className="icon is-small">
                              <i className="fas fa-shield-alt"></i>
                            </span>
                            <span>Admin</span>
                          </span>
                        ) : (
                          <span className="tag is-light">User</span>
                        )}
                      </td>
                      <td className="has-text-right" onClick={(e) => e.stopPropagation()}>
                        <Link
                          className="button is-small is-danger is-light"
                          data-testid={`deleteUser${user.id}`}
                          to={`/users/${user.id}/delete`}
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
                <i className="fas fa-users fa-3x"></i>
              </span>
              <p className="mt-4 mb-4">No users found. Create your first one!</p>
              <button
                className="button is-primary"
                onClick={() => history.push("users/new")}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Add User</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
