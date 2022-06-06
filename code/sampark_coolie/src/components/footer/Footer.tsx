import React, { useEffect } from 'react'
import { useNavigate, useMatch, useLocation } from 'react-router-dom'

export const Footer = () => {
    const location = useLocation();

    return (
        <footer id="footer">
            <div className="container">
                {
                    (location && location.pathname !== '/booknow') &&
                    <div className="foot-section">
                        <ul>
                            <li className="foot-one"><a href=""><img src={require("../../assets/images/logo2.png")} /></a></li>
                            <li className="foot-two">
                                <a href="">Blogs</a>
                                <a href="">App</a>
                                <a href="">Career</a>
                                <a href="">Login</a>
                            </li>
                            <li className="foot-three">
                                <p>Rate quotes based on pricing agreements, with customizable functions and reporting, dynamic routing for on-time pickups and deliveries, with real-time visibility. Data-driven algorithms for optimal pricing and productivity management.</p>
                                <br />
                                <p> Robust customer self-service platform for end-to-end shipping management. Intelligent tools for higher trailer utilization and safe load-building.</p>
                            </li>
                        </ul>
                        <div className="copyright-line">  <span>© Copyright Coolie 2021</span></div>
                    </div>
                }
            </div>
        </footer>
    )
}
