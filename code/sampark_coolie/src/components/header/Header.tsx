import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import configs from '../../configs/apiConfigs';
import { getCookie } from '../../utils/cookies'
export const Header = () => {
    const history = useNavigate();
    const location = useLocation();
    const login = getCookie();
    useEffect(() => {
        if (!login) {
            history('/login');
        }
    }, []);

    const handleLogin = () => {

    }

    const handleLogout = () => {
        Cookies.remove('coolie_cookie');
        Cookies.remove('coolie_cookie', { domain: configs.COOKIE_DOMAIN });
        history('/login')
    }
    return (
        <header id="header">
            <div className="container">
                <div className="headerIn">
                    <a className="logo " href="#"><img src={require("../../assets/images/logo.svg").default} /></a>
                    <nav className="navbar navbar-expand-lg ">
                        <div className="container-fluid">
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="#">Blog </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Support</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">About Us</a>
                                    </li>
                                    <li className="nav-item track-line">
                                        <a className="nav-link" href="#">Track</a>
                                    </li>
                                </ul>
                                <form className="form-inline my-2 my-lg-0">
                                    <button className="btn loginBtn my-2 my-sm-0" type="submit"
                                        onClick={() => {
                                            login ? handleLogout() : handleLogin()
                                        }}
                                    >{login ? 'Logout' : 'Login'}</button>
                                </form>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}
