//personal info
import Navbar from "../../components/navbar/navbar";
import { Link } from "react-router-dom";
import "./personalInfo.scss";
import axios from 'axios';
import { AuthContext } from "../../utils/authentication/auth-context";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import RegexUtil from "../../utils/regex-util";
import { Replay30 } from "@mui/icons-material";

/**
 * Returns a react component consisting of the Personal Info page. 
 * Includes all logic relevant to logging in.
 * 
 * @returns a react component consisting of the Personal Info page.
 */
const PersonalInfo = () => {
    const { user } = useContext(AuthContext); // get user from auth context
    const userId = user._id;

    /* Error messages */
    const EXISTING_CREDENTIALS_ERROR = "Email, phone number, or username already taken.";
    const INVALID_EMAIL_OR_PHONE_ERROR = "Invalid email or phone number format.";
    const INVALID_USERNAME_ERROR = "Invalid username. Username cannot contain spaces and minimum length must be at least ";
    const INVALID_PASSWORD_ERROR = "Invalid password. The length must be at least ";
    const SUCCESS_MESSAGE = "Successfully updated your personal information!";

    /* Text colors */
    const RED = "red";
    const WHITE = "white";

    /* Existing user info to be displayed */
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [membership, setMembership] = useState('');

    /* User info to be changed to (in input boxes) */
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newNumber, setNewPhoneNumber] = useState('');
    const [newPassword, setNewPassword] = useState('');

    /* Error message to display*/
    const [message, setMessage] = useState(EXISTING_CREDENTIALS_ERROR);

    /* Whether we have an error*/
    const [error, setError] = useState(false);

    /* Whether update was successful*/
    const [successful, setSuccessful] = useState(false);

    /* Message color (RED = error, WHITE = success) */
    const [messageColor, setMessageColor] = useState(RED);

    /* retrieves the latest user info */
    const getUserInfo = () => {
        axios.get('users/find/' + user._id, {
            headers: {
                token: "Bearer " + user.accessToken
            }
        }).then(res => {
            setPhoneNumber(res.data.phone);
            setEmail(res.data.email);
            setUsername(res.data.username);
            var origin = new Date(parseInt(res.data._id.toString().slice(0, 8), 16) * 1000);
            var today = new Date();
            var diffms = Math.abs(today - origin);
            var membertime = diff(diffms);
            setMembership(membertime);
        }).catch(err => {
            console.log(err)
        })
    };
    /* util function for converting ms to dd:hh:mm*/
    function diff(t) {
        var day = 1000 * 60 * 60 * 24;

        var days = Math.floor(t / day);
        var months = Math.floor(days / 31);
        var years = Math.floor(months / 12);

        if (days > 30) {
            days %= 30;
        }
        if (months > 12) {
            months %= 12;
        }

        var message = days + " days ";
        message += months + " months ";
        message += years + " years ago";

        return message
    }

    /* get user info on first render */
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current === true) {
            getUserInfo();
            isFirstRender.current = false;
        }
    });

    /* Have success message disappear after 5 seconds */
    useEffect(() => {
        if (successful) {
            setTimeout(() => {
                setSuccessful(false);
            }, 5000);
        }
    }, [successful]);

    /* Updates username when user initiates through the UI */
    const handleUpdateUsername = async (e) => {
        /* Prevent default event behavior */
        e.preventDefault();

        /* reset all error messages at start of event */
        setError(false);

        /* check valid username */
        if (!RegexUtil.isValidUsernameFormat(newUsername)) {
            setMessage(INVALID_USERNAME_ERROR + RegexUtil.NAME_LENGTH);
            setMessageColor(RED);
            setError(true);
            return;
        }

        /* Make HTTP request to update info */
        try {
            await axios.put('users/personalInfo', {
                id: userId,
                username: newUsername,
            }, {
                headers: {
                    token: "Bearer " + user.accessToken
                }
            });

            /* Update fields upon success */
            setMessage(SUCCESS_MESSAGE);
            setMessageColor(WHITE);
            setSuccessful(true);
            setNewUsername("");
        } catch (err) {
            setMessage(EXISTING_CREDENTIALS_ERROR);
            setMessageColor(RED);
            setError(true);
            console.log(err);
        }

        /* Load and display new user information */
        getUserInfo();
    };

    /* Updates email when user initiates through the UI */
    const updateEmail = async (e) => {
        /* Prevent default event behavior */
        e.preventDefault();

        /* reset all error messages at start of event */
        setError(false);

        /* check valid email */
        if (!RegexUtil.isValidEmailFormat(newEmail)) {
            setMessage(INVALID_EMAIL_OR_PHONE_ERROR);
            setMessageColor(RED);
            setError(true);
            return;
        }

        /* Make HTTP request to update info */
        try {
            await axios.put('users/personalInfo', {
                id: userId,
                email: newEmail,
            }, {
                headers: {
                    token: "Bearer " + user.accessToken
                }
            });

            /* Update fields upon success */
            setMessage(SUCCESS_MESSAGE);
            setMessageColor(WHITE);
            setSuccessful(true);
            setNewEmail("");
        } catch (err) {
            setMessage(EXISTING_CREDENTIALS_ERROR);
            setMessageColor(RED);
            setError(true);
            console.log(err);
        }

        /* Load and display new user information */
        getUserInfo();
    };

    /* Updates phone number when user initiates through the UI */
    const updatePhone = async (e) => {
        /* Prevent default event behavior */
        e.preventDefault();

        /* reset all error messages at start of event */
        setError(false);

        /* check valid username */
        if (!RegexUtil.isValidPhoneFormat(newNumber)) {
            setMessage(INVALID_EMAIL_OR_PHONE_ERROR);
            setMessageColor(RED);
            setError(true);
            return;
        }

        /* Make HTTP request to update info */
        try {
            await axios.put('users/personalInfo', {
                id: userId,
                phone: RegexUtil.stripNonDigits(newNumber),
            }, {
                headers: {
                    token: "Bearer " + user.accessToken
                }
            });

            /* Update fields upon success */
            setMessage(SUCCESS_MESSAGE);
            setMessageColor(WHITE);
            setSuccessful(true);
            setNewPhoneNumber("");
        } catch (err) {
            setMessage(EXISTING_CREDENTIALS_ERROR);
            setMessageColor(RED);
            setError(true);
            console.log(err);
        }

        /* Load and display new user information */
        getUserInfo();
    };

    /* Updates password when user initiates through the UI */
    const updatePassword = async (e) => {
        /* Prevent default event behavior */
        e.preventDefault();

        /* reset all error messages at start of event */
        setError(false);

        /* check valid username */
        if (!RegexUtil.isValidPasswordFormat(newPassword)) {
            setMessage(INVALID_PASSWORD_ERROR + RegexUtil.MIN_PASSWORD_LENGTH);
            setMessageColor(RED);
            setError(true);
            return;
        }

        /* Make HTTP request to update info */
        try {
            await axios.put('users/personalInfo', {
                id: userId,
                password: newPassword,
            }, {
                headers: {
                    token: "Bearer " + user.accessToken
                }
            });

            /* Update fields upon success */
            setMessage(SUCCESS_MESSAGE);
            setMessageColor(WHITE);
            setSuccessful(true);
            setNewPassword("");
        } catch (err) {
            console.log(err);
        }

        /* Load and display new user information */
        getUserInfo();
    };

    return (
        <div className="personalInfo">
            <Navbar />

            <div className="personalInfoForm">
                <div className="container">
                    <form>
                        <h1>Personal Info</h1>
                        <button type='button' className="infoButton">Username: <span>{username}</span> </button>
                        <button type='button' className="infoButton">Email: <span>{email}</span></button>
                        <button type='button' className="infoButton">Phone number: <span>{phoneNumber}</span></button>
                        <button type='button' className="infoButton">Member since: <span>{membership}</span></button>

                        <label>
                            <div className="infoType"> {"Change username: "}</div>
                            <input
                                type="username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateUsername(e)}
                            />
                            <button onClick={handleUpdateUsername} className="formButton">Submit</button>

                        </label>

                        <label>
                            <div className="infoType"> {"Change email: "}</div>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="input"
                                onKeyDown={(e) => e.key === 'Enter' && updateEmail(e)}
                            />
                            <button onClick={updateEmail} className="formButton">Submit</button>
                        </label>

                        <label>
                            <div className="infoType"> {"Change phone number: "}</div>
                            <input
                                type="phone"
                                value={newNumber}
                                onChange={(e) => setNewPhoneNumber(e.target.value)}
                                className="input"
                                onKeyDown={(e) => e.key === 'Enter' && updatePhone(e)}
                            />
                            <button onClick={updatePhone} className="formButton">Submit</button>
                        </label>

                        <label>
                            <div className="infoType"> {"Change password: "}</div>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input"
                                onKeyDown={(e) => e.key === 'Enter' && updatePassword(e)}
                            />
                            <button onClick={updatePassword} className="formButton">Submit</button>
                        </label>

                        { // error message if user enters invalid email regex or credentials already taken
                            <div className="errorMessage"
                                style={{
                                    visibility: (!error && !successful) && "hidden",
                                    color: messageColor
                                }}>
                                <p >
                                    {message}
                                </p>
                            </div>
                        }

                        {/* <Link to="/profPic" className="link">
                            <button className="button2">Edit profile picture </button>
                        </Link> */}

                        <Link to="/settings" className="link">
                            <button className="backButton">Back</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;
