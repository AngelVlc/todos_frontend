import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';

export const ListsPage = () => {
    const [lists, setLists] = useState([]);
    let history = useHistory();

    useEffect(() => {
        const getLists = async () => {
            const res = await axios.get('lists')
            setLists(res.data);
        }
        getLists();
    }, []);

    return (
        <div className="container">
            <h3 className="title">LISTS</h3>
            <table className="table">
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>
                            <button className="button is-small" data-testid="addNew" onClick={() => history.push('lists/new')}>
                                <span className="icon is-small">
                                    <i className="fas fa-plus"></i>
                                </span>
                            </button>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {lists.length > 0 && lists.map((list) => (
                        <tr key={list.id}>
                            <td>
                                <Link className="has-text-black" data-testid={`editList${list.id}`} to={`/lists/${list.id}/edit`}>{list.name}</Link>
                            </td>
                            <td>
                                <center>
                                    <Link className="has-text-black" data-testid={`deleteList${list.id}`} to={`/lists/${list.id}/delete`}>
                                        <span className="icon is-small">
                                            <i className="fas fa-trash-alt fa-xs"></i>
                                        </span>
                                    </Link>
                                </center>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </div>
    )
}