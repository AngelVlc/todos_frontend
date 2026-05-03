import React, { useRef, useContext } from 'react';
import { AppContext } from '../../contexts';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { userLoggedOut } from '../../actions';

export const Header = () => {
    const { auth, authDispatch } = useContext(AppContext)
    const navBarMenuRef = useRef();
    const navBarBurguerRef = useRef();
    let history = useHistory();

    const onLogoutClick = async () => {
        onToggleNavBar();
        try {
            await axios.post('/auth/logout');
        } catch (error) {
        } finally {
            localStorage.removeItem('authToken');
            authDispatch(userLoggedOut());
            history.push('/login');
        }
    }

    const onToggleNavBar = () => {
        navBarMenuRef.current.classList.toggle('is-active');
        navBarBurguerRef.current.classList.toggle('is-active');
    }

    return (
        <nav className="navbar is-dark">
            <div className="navbar-brand">
                <span className="navbar-item is-size-3">To Dos</span>
                {auth.info &&
                    <div className="navbar-burger" ref={navBarBurguerRef} onClick={(e) => onToggleNavBar(e)}>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </div>
                }
            </div>
            <div className="navbar-menu" ref={navBarMenuRef}>
                <div className="navbar-start">
                    {auth.info &&
                        <>
                            <span className="navbar-item is-clickable" data-testid="goToRoot" onClick={() => history.push('/')}>Home</span>
                            <span className="navbar-item is-clickable" data-testid="goToLists" onClick={() => history.push('/lists')}>Lists</span>
                        </>
                    }
                    {auth.info?.isAdmin &&
                        <span className="navbar-item is-clickable" data-testid="goToUsers" onClick={() => history.push('/users')}>Users</span>
                    }
                </div>
                {auth.info &&
                    <div className="navbar-end">
                        <hr className="my-0"></hr>
                        <span className="navbar-item is-clickable" data-testid="logOut" onClick={() => onLogoutClick()}>Log Out {auth.info.name}</span>
                    </div>
                }
            </div>
        </nav>
    )
}
