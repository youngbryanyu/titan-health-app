/* navigation bar at top of page */
import "./navbar.scss";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import logo from "../titan-clear-logo.png"
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { logout } from "../../utils/authentication/auth-helper";
import { AuthContext } from "../../utils/authentication/auth-context";
import React from "react";
import ROUTES from "../../routes";

/**
 * Returns a react component consisting of the Navigation bar on top of every page. 
 * Includes all logic relevant to the nav bar.
 * 
 * @returns a react component consisting of the Navigation bar.
 */
const Navbar = () => {
    /* Whether we scrolled down */
    const [isScrolled, setIsScrolled] = useState(false);

    /* User authentication context/cache*/
    const { dispatch } = useContext(AuthContext);

    /* Used to navigate to different pages */
    const navigate = useNavigate();

    /* Function to navigate handle logging out */
    const handleLogout = (e) => {
        /* Prevent default event behavior */
        e.preventDefault();
        
        logout(dispatch);
        navigate(ROUTES.LOGIN);
    }

    /* Make nav bar black when we scroll past y=0 */
    window.onscroll = () => {
        setIsScrolled(window.pageYOffset === 0 ? false : true);
        return () => (window.onscroll = null);
    };

    /* Get user from auth context*/
    // const { user } = useContext(AuthContext); 

    /* Return react component */
    return (
        <div className={isScrolled ? "navbar scrolled" : "navbar"}>
            <div className="container">
                <div className="left">
                    <Link to={ROUTES.HOME} className="link">
                        <img
                            src={logo} // TODO: replace logo
                            alt=""
                        />
                    </Link>
                    <Link to={ROUTES.HOME} className="link">
                        <span>Home</span>
                    </Link>
                    <Link to={ROUTES.PREFERENCES} className="link">
                        <span>Preferences</span>
                    </Link>
                </div>
                <div className="right">
                    <div className="profile">
                        <MenuIcon className="icon" />
                        <div className="options">
                            <Link to={ROUTES.SETTINGS} className="link">
                                <span className="highlight">Settings</span>
                            </Link>
                            <Link to={ROUTES.LOGIN} className="link"> {/* won't work until user becomes logged out */}
                                <span className="highlight" onClick={handleLogout}>Logout</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
