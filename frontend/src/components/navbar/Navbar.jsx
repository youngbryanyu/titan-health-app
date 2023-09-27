/* navigation bar at top of page */
import "./navbar.scss";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import logo from "./titan_clear_logo.png"
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { logout } from "../../authContext/apiCalls";
import { AuthContext } from "../../authContext/AuthContext";
import React from "react";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { dispatch } = useContext(AuthContext); // get auth context

    const navigate = useNavigate();

    /* Function to navigate handle logging out */
    const handleLogout = (e) => {
        e.preventDefault(); // prevent default event behavior
        logout(dispatch);
        navigate("/login");
    }

    /* Make nav bar black when we scroll past y=0 */
    window.onscroll = () => {
        setIsScrolled(window.pageYOffset === 0 ? false : true);
        return () => (window.onscroll = null);
    };

    /* Get user from auth context*/
    const { user } = useContext(AuthContext); 

    return (
        <div className={isScrolled ? "navbar scrolled" : "navbar"}>
            <div className="container">
                <div className="left">
                    <Link to="/" className="link">
                        <img
                            src={logo} // TODO: replace logo
                            alt=""
                        />
                    </Link>
                    <Link to="/" className="link">
                        <span>Home</span>
                    </Link>
                </div>
                <div className="right">
                    <div className="profile">
                        <MenuIcon className="icon" />
                        <div className="options">
                            <Link to="/settings" className="link">
                                <span className="highlight">Settings</span>
                            </Link>
                            <Link to="/login" className="link"> {/* won't work until user becomes logged out */}
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
