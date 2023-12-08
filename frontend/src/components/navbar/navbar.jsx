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

        /* Log user out and navigate to login */
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


                    <div className="dropdown">
                        <span>Health ▾</span>
                        <div className="healthDropdownOptions">
                            <Link to={ROUTES.OTHER_HEALTH_TRACKER} className="link">
                                <span>Health Tracker</span>
                            </Link>
                        </div>
                    </div>
                    <div className="dropdown">
                        <span>Fitness ▾</span>
                        <div className="fitnessDropdownOptions">
                            <Link to={ROUTES.EXERCISE_TRACKER} className="link">
                                <span>Exercise Tracker</span>
                            </Link>
                        </div>
                    </div>
                    <div className="dropdown">
                        <span>Nutrition ▾</span>
                        <div className="nutritionDropdownOptions">
                            <Link to={ROUTES.MEAL_TRACKER} className="link">
                                <span>Meal Tracker</span>
                            </Link>
                            <Link to={ROUTES.PREFERENCES} className="link">
                                <span>Dietary Preferences</span>
                            </Link>
                            <Link to={ROUTES.LOW_LEVEL_NUTRITION} className="link">
                                <span>Nutriton Goals</span>
                            </Link>
                        </div>
                    </div>
                    <div className="dropdown">
                        <span>Dining courts ▾</span>
                        <div className="diningDropdownOptions">
                            <Link to={ROUTES.MENU_INFO + "/Windsor"} className="link">
                                <span className="highlight">Windsor</span>
                            </Link>
                            <Link to={ROUTES.MENU_INFO + "/Wiley"} className="link">
                                <span className="highlight">Wiley</span>
                            </Link>
                            <Link to={ROUTES.MENU_INFO + "/Ford"} className="link">
                                <span className="highlight">Ford</span>
                            </Link>
                            <Link to={ROUTES.MENU_INFO + "/Earhart"} className="link">
                                <span className="highlight">Earhart</span>
                            </Link>
                            <Link to={ROUTES.MENU_INFO + "/Hillenbrand"} className="link">
                                <span className="highlight">Hillenbrand</span>
                            </Link>
                        </div>
                    </div>
                    <div className="dropdown">
                        <span>More Dining ▾</span>
                        <div className="moreDiningDropdownOptions">
                            <Link to={ROUTES.SAVED_MENU_ITEMS} className="link">
                                <span>Saved Menu Items</span>
                            </Link>
                            <Link to={ROUTES.POPULAR_MENU_ITEMS} className="link">
                                <span>Popular Menu Items</span>
                            </Link>
                            <Link to={ROUTES.RECOMMENDED_MENU_ITEMS} className="link">
                                <span>Recommended Menu Items</span>
                            </Link>
                        </div>
                    </div>
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
