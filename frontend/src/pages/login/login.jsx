/* React page for login */
import "./login.scss";
import { login } from "../../utils/authentication/auth-helper";
import logo from "../../components/titan-clear-logo.png";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../utils/authentication/auth-context";
import { useEffect, useRef, useContext, useState } from "react";
import RegexUtil from "../../utils/regex-util";
import ROUTES from "../../routes";

/**
 * Returns a react component consisting of the Login page. Includes all logic relevant to logging in.
 * 
 * @returns a react component consisting of the Login page.
 */
export default function Login() {
    /* Message displayed if user just registered and was redirected to this page */
    const JUST_REGISTERED_MESSAGE = "Your registration was successful!"

    /* Whether the user was redirected to the login page from registering */
    const [recentlyRegistered, setRecentlyRegistered] = useState(false);

    /* Login type that user entered */
    const [emailOrPhoneOrUsername, setEmailOrPhoneOrUsername] = useState("");

    /* Password that user entered*/
    const [password, setPassword] = useState("");

    /* Whether user entered valid credentials */
    const [isValidCredentials, setIsValidCredentials] = useState(true);

    /* Authentication context */
    const { dispatch } = useContext(AuthContext);
    
    /* The current user */
    const [user, setUser] = useState({}); // begin with {} instead of null b/c useEffect detects changes to null as well

    /* Handles logging in the user */
    const handleLogin = (e) => {
        /* Prevent default event behavior */
        e.preventDefault(); 

        /* strip non-digits if user is trying to login with phone number */
        const loginMethod = RegexUtil.isValidPhoneFormat(emailOrPhoneOrUsername) ? RegexUtil.stripNonDigits(emailOrPhoneOrUsername) : emailOrPhoneOrUsername;
                
        /* Login and store the user in cache (authentication context) */
        login({ loginMethod, password }, dispatch).then(
            returnedUser => setUser(returnedUser)
        );
    }

    /* After log in attempt, set flag for whether or not it was a successful attempt */
    const isFirstRender = useRef(true); 
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (user == null) {
            setIsValidCredentials(false);
        }
    }, [user]);

    /* Gets location that user navigated from */
    const location = useLocation(); 

    /* Gets whether user just registered (navigated from register page) */
    useEffect(() => {
        if (location.state != null) {
            setRecentlyRegistered(location.state.justRegistered);
        }
    }, [location.state]);

    /* Display a 5 second message informing the user their sign up was successful */
    useEffect(() => {
        if (recentlyRegistered) {
            window.history.replaceState({}, document.title, null); // prevents message from showing up after page reload
            setTimeout(() => {
                setRecentlyRegistered(false);
            }, 5000);
        }
    }, [recentlyRegistered]);

    /* Return react component */
    return (
        <div className="login">
            <div className="top">
                <div className="wrapper">
                    <img
                        className="logo"
                        src={logo}
                        alt=""
                    />
                </div>
            </div>

            <div className="container">
                <div className="recentlyRegisteredMessage"> {/* message if brought to login after registering */}
                    <p style={{ visibility: !recentlyRegistered && "hidden" }}>
                        {JUST_REGISTERED_MESSAGE}
                    </p>
                </div>

                <form>
                    <h1>Sign In</h1>
                    <input type="email" placeholder="Phone number, username, or email" onChange={(e) => setEmailOrPhoneOrUsername(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button className="loginButton" onClick={handleLogin}>Sign In</button>

                    <div className="errorMessage"> {/* error message if invalid credentials (user == null) */}
                        <p style={{ visibility: isValidCredentials && "hidden" }}>
                            Invalid login credentials.
                        </p>
                    </div>

                    <span>
                        New to Titan?
                        <b className="signUp">
                            <Link to={ROUTES.REGISTER} className="link"> Sign up now.</Link>
                        </b>
                    </span>
                    {/* <small>
                        <b className="forgotYourPassword"> <Link to="/forgotPassword" className="link">Forgot your password?</Link> </b>
                    </small> */}
                    {/* <small>
                        This page is protected by Google reCAPTCHA to ensure you're not a
                        bot. <b className="learnMore">Learn more</b>.
                    </small> */}
                </form>
            </div>
        </div>
    );
}