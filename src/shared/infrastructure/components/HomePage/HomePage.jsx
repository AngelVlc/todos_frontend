import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { AppContext } from '../../contexts';

export const HomePage = () => {
    const { auth } = useContext(AppContext)
    let history = useHistory();

    return (
        <section className="section">
            <div className="container">
                <h1 className="title has-text-centered mb-6">Welcome to To Dos</h1>
                
                {auth.info?.isAdmin && (
                    <div className="mb-6">
                        <h2 className="subtitle is-5 has-text-grey mb-4">Admin</h2>
                    <div className="columns is-multiline">
                        <div className="column is-4 is-6-tablet is-12-mobile">
                            <div className="card is-hoverable" onClick={() => history.push('/users')} style={{cursor: 'pointer'}}>
                                <div className="card-content has-text-centered">
                                    <span className="icon is-large has-text-info">
                                        <i className="fas fa-users fa-2x"></i>
                                    </span>
                                    <p className="title is-5 mt-3">Users</p>
                                    <button 
                                        className="button is-info is-light is-fullwidth mt-3" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            history.push('/users');
                                        }} 
                                        data-testid="users"
                                    >
                                        Manage
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="column is-4 is-6-tablet is-12-mobile">
                            <div className="card is-hoverable" onClick={() => history.push('/refreshtokens')} style={{cursor: 'pointer'}}>
                                <div className="card-content has-text-centered">
                                    <span className="icon is-large has-text-warning">
                                        <i className="fas fa-key fa-2x"></i>
                                    </span>
                                    <p className="title is-5 mt-3">Refresh Tokens</p>
                                    <button 
                                        className="button is-warning is-light is-fullwidth mt-3" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            history.push('/refreshtokens');
                                        }} 
                                        data-testid="refreshTokens"
                                    >
                                        Manage
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="column is-4 is-12-tablet is-12-mobile">
                            <div className="card is-hoverable" onClick={() => history.push('/index-all-lists')} style={{cursor: 'pointer'}}>
                                <div className="card-content has-text-centered">
                                    <span className="icon is-large has-text-success">
                                        <i className="fas fa-list-ul fa-2x"></i>
                                    </span>
                                    <p className="title is-5 mt-3">Index All Lists</p>
                                    <button 
                                        className="button is-success is-light is-fullwidth mt-3" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            history.push('/index-all-lists');
                                        }} 
                                        data-testid="indexLists"
                                    >
                                        Index
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                )}

                <div>
                    <h2 className="subtitle is-5 has-text-grey mb-4">Lists</h2>
                    <div className="columns is-multiline">
                        <div className="column is-4 is-6-tablet is-12-mobile">
                            <div className="card is-hoverable" onClick={() => history.push('/lists')} style={{cursor: 'pointer'}}>
                                <div className="card-content has-text-centered">
                                    <span className="icon is-large has-text-primary">
                                        <i className="fas fa-list fa-2x"></i>
                                    </span>
                                    <p className="title is-5 mt-3">Lists</p>
                                    <button 
                                        className="button is-primary is-light is-fullwidth mt-3" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            history.push('/lists');
                                        }} 
                                        data-testid="lists"
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="column is-4 is-6-tablet is-12-mobile">
                            <div className="card is-hoverable" onClick={() => history.push('/categories')} style={{cursor: 'pointer'}}>
                                <div className="card-content has-text-centered">
                                    <span className="icon is-large has-text-link">
                                        <i className="fas fa-tags fa-2x"></i>
                                    </span>
                                    <p className="title is-5 mt-3">Categories</p>
                                    <button 
                                        className="button is-link is-light is-fullwidth mt-3" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            history.push('/categories');
                                        }} 
                                        data-testid="categories"
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
