/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signOut2 } from "../firebase";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import Search from "./Search";

const Nav = props => {
    const { state, dispatch } = useContext(AuthContext);
    const navigate = useNavigate(); 

    const { user } = state;

    useEffect(() => {
        document.onclick = e => {
           if (e.target.className.includes('nav-link dropdown-toggle')
           || (e.target.className.includes('form-control') && e.target.type === 'search')) {
               return;
           }
           
           const navbarToggler = document.getElementsByClassName('navbar-toggler')[0];
           const navbarCollapse = document.getElementsByClassName('navbar-collapse')[0];
           if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
           }           
        };
    });

    const logout = () => {
        signOut2(auth).then(() => {
            dispatch({
                type: 'LOGGED_IN_USER',
                payload: null
            });
            navigate('/login');
        }).catch((error) => {
            toast.error(error.message);
        });
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" 
                to="/">Home</Link>
                <button
                className="navbar-toggler"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <i className="fas fa-bars"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link"
                            to="/users">Users</Link>
                        </li>
                        {
                            !user && <li className="nav-item">
                                <Link className="nav-link"
                                to="/login">Login</Link>
                            </li>
                        }
                        {
                            !user && <li className="nav-item">
                                <Link className="nav-link" to="/register">Register</Link>
                            </li>
                        }
                        {
                            user && <li className="nav-item dropdown">
                                <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdownMenuLink"
                                role="button"
                                data-mdb-toggle="dropdown"
                                aria-expanded="false"
                                >
                                {user && user.email ?
                                user.email.split('@')[0] : 'Dashboard'}
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li>
                                    <Link className="dropdown-item" to='/profile'>
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to='/password/update'>
                                        Update Password
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to='/post/create'>
                                        Post
                                    </Link>
                                </li>
                                </ul>
                            </li>
                        }
                        {
                            user && <li className="nav-item">
                                <a onClick={logout} className="nav-item nav-link" href="#">Logout</a>
                            </li>
                        }
                    </ul>
                    <div className="ml-auto">
                        <Search/>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;