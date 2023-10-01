/* JS for settings page */
import Navbar from "../../components/navbar/navbar";
import "./settings.scss";
import { Link, useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { logout } from "../../utils/authentication/auth-helper";
import { AuthContext } from "../../utils/authentication/auth-context";
import { useContext } from "react";
import ROUTES from "../../routes";


/**
 * Returns a react component consisting of the Settings page. 
 * Includes all logic relevant to logging in.
 * 
 * @returns a react component consisting of the Settings page.
 */
const Settings = () => {
    const { dispatch } = useContext(AuthContext); // get auth context
    const navigate = useNavigate();

    /* Handles logging out if user clicks logout */
    const handleLogout = (e) => {
        e.preventDefault();
        logout(dispatch);
        navigate(ROUTES.LOGIN);
    }

    return (
        <div className="settings">
            <Navbar />
            <div className="centered">
                <Grid container rowSpacing={10} columnSpacing={{ xs: 10, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <div className="about">
                            <Box className="box">
                                <span className="pageTitle">{"Info & Settings"}</span>
                            </Box>
                        </div>
                    </Grid>

                    <Grid item xs={3}>
                        <div className="column1">
                            <Box className="box">
                                <Link to={ROUTES.PERSONAL_INFO} className="link">
                                    <span className="buttonText">Personal Information</span>
                                </Link>
                            </Box>
                            <Box className="box">
                                <Link to={ROUTES.PREFERENCES} className="link">
                                    <span className="buttonText">Dietary Preferences</span>
                                </Link>
                            </Box>
                            <Box className="box">
                                {/* <Link to="/notifications" className="link"> */}
                                    <span className="buttonText">Notifications</span>
                                {/* </Link> */}
                            </Box>
                        </div>
                    </Grid>

                    <Grid item xs={3}>
                        <div className="column2">
                            <Box className="box">
                                <Link to={ROUTES.REPORT_PROBLEM} className="link">
                                    <span className="buttonText">Report a Problem</span>
                                </Link>
                            </Box>
                            <Box className="box">
                                {/* <Link to="/deleteAccount" className="link"> */}
                                    <span className="buttonText">Delete Account</span>
                                {/* </Link> */}
                            </Box>
                            <Box className="box">
                                <Link to="/login" className="link">
                                    <span className="buttonText" onClick={handleLogout}>Logout</span>
                                </Link>
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default Settings;