import React, { useRef, useContext, useState } from 'react';
import { AppContext } from '../../contexts';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { userLoggedOut } from '../../actions';

export const Header = () => {
    const { auth, authDispatch } = useContext(AppContext)
    const navBarMenuRef = useRef();
    const navBarBurguerRef = useRef();
    const dropdownMenuRef = useRef();
    let history = useHistory();
    const [isDropdownActive, setIsDropdownActive] = useState(false);

    const onLogoutClick = async () => {
        setIsDropdownActive(false);
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

    const toggleDropdown = () => {
        setIsDropdownActive(!isDropdownActive);
    }

    const handleNavigation = (path) => {
        history.push(path);
        setIsDropdownActive(false);
        // Close mobile menu if open
        if (navBarMenuRef.current?.classList.contains('is-active')) {
            onToggleNavBar();
        }
    }

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation" style={{background: 'linear-gradient(135deg, #e0e7ff 0%, #d1c4e9 100%)'}}>
            <div className="navbar-brand">
                <span className="navbar-item is-size-4 has-text-weight-bold" onClick={() => handleNavigation('/')} style={{cursor: 'pointer'}}>
                    <span className="icon mr-2">
                        <i className="fas fa-tasks"></i>
                    </span>
                    To Dos
                </span>
                {auth.info &&
                    <button 
                        className="navbar-burger" 
                        ref={navBarBurguerRef} 
                        onClick={onToggleNavBar}
                        aria-label="menu" 
                        aria-expanded="false"
                        data-testid="navbarBurger"
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </button>
                }
            </div>
            <div className="navbar-menu" ref={navBarMenuRef}>
                <div className="navbar-start">
                    {auth.info &&
                        <>
                            <span 
                                className="navbar-item is-clickable" 
                                data-testid="goToRoot" 
                                onClick={() => handleNavigation('/')}
                            >
                                <span className="icon mr-1">
                                    <i className="fas fa-home"></i>
                                </span>
                                Home
                            </span>
                            <span 
                                className="navbar-item is-clickable" 
                                data-testid="goToLists" 
                                onClick={() => handleNavigation('/lists')}
                            >
                                <span className="icon mr-1">
                                    <i className="fas fa-list"></i>
                                </span>
                                Lists
                            </span>
                            <span 
                                className="navbar-item is-clickable" 
                                data-testid="goToCategories" 
                                onClick={() => handleNavigation('/categories')}
                            >
                                <span className="icon mr-1">
                                    <i className="fas fa-tags"></i>
                                </span>
                                Categories
                            </span>
                        </>
                    }
                    {auth.info?.isAdmin &&
                        <span 
                            className="navbar-item is-clickable" 
                            data-testid="goToUsers" 
                            onClick={() => handleNavigation('/users')}
                        >
                            <span className="icon mr-1">
                                <i className="fas fa-users"></i>
                            </span>
                            Users
                        </span>
                    }
                </div>
                {auth.info &&
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className={`dropdown is-right ${isDropdownActive ? 'is-active' : ''}`} ref={dropdownMenuRef}>
                                <div className="dropdown-trigger">
                                    <button 
                                        className="button is-small is-white" 
                                        aria-haspopup="true" 
                                        aria-controls="dropdown-menu"
                                        onClick={toggleDropdown}
                                        data-testid="userDropdown"
                                    >
                                        <span className="icon is-small">
                                            <i className="fas fa-user-circle"></i>
                                        </span>
                                        <span className="has-text-dark has-text-weight-semibold">{auth.info.name}</span>
                                        <span className="icon is-small">
                                            <i className={`fas fa-chevron-down ${isDropdownActive ? 'is-rotated' : ''}`}></i>
                                        </span>
                                    </button>
                                </div>
                                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                    <div className="dropdown-content">
                                        <div className="dropdown-item">
                                            <p className="has-text-weight-semibold">{auth.info.name}</p>
                                            <p className="is-size-7 has-text-grey">{auth.info.isAdmin ? 'Administrator' : 'User'}</p>
                                        </div>
                                        <hr className="dropdown-divider" />
                                        <button 
                                            className="button is-white is-fullwidth has-text-danger"
                                            onClick={onLogoutClick}
                                            data-testid="logOut"
                                        >
                                            <span className="icon">
                                                <i className="fas fa-sign-out-alt"></i>
                                            </span>
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </nav>
    )
}
