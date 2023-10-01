// JS for settings page
import Navbar from "../../components/navbar/navbar";
import "./settings.scss";
// import Footer from "../../components/footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { logout } from "../../utils/authentication/auth-helper";
import { AuthContext } from "../../utils/authentication/auth-context";
import { useContext } from "react";
import ROUTES from "../../routes";



const Settings = () => {
    const { dispatch } = useContext(AuthContext); // get auth context
    const navigate = useNavigate();

    /**
     * Logs the user out
     */
    const handleLogout = (e) => {
        e.preventDefault(); // need this to prevent default behavior or else login won't work
        logout(dispatch); // login and store the user in local storage (context)
        navigate("/login");
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
                                {/* <Link to="/personalInfo" className="link"> */}
                                    <span className="buttonText">Personal Information</span>
                                {/* </Link> */}
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