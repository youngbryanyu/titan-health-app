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

const EXISTING_CREDENTIALS_ERROR = "Email, phone number, or username already taken.";
const INVALID_EMAIL_OR_PHONE_ERROR = "Invalid email or phone number format.";
const INVALID_USERNAME_ERROR = "Invalid username. Username cannot contain spaces and minimum length must be at least ";
const INVALID_PASSWORD_ERROR = "Invalid password. The length must be at least ";
const SUCCESS_MESSAGE = "Successfully updated your personal information!";

// TODO: add password editing feature
// TODO: add validation for modifying user information (like in registration)
// TODO: handle enters
const PersonalInfo = () => {
    const { user } = useContext(AuthContext); // get user from auth context
    const url = 'users/find/' + user._id; //get the user id field from api
    const putUrl = 'users/' + user._id; //this is the url that is needed in order to make a put request
    const accessTok = user.accessToken;
    const auth = `Bearer ${accessTok}`; //full authtoken

    const RED = "red"; // message colors
    const WHITE = "white";

    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState(EXISTING_CREDENTIALS_ERROR);
    const [error, setError] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const [messageColor, setMessageColor] = useState(RED);

    /* retrieves the latest user info */
    const getUserInfo = () => {
        axios.get(url) //put the entire url including the user
            .then(res => {
                //console.log(res);
                setNumber(res.data.phone)
                setEmail(res.data.email)
                setUsername(res.data.username)
            }).catch(err => {
                console.log(err)
            })
    };
    /* get user info on first render */
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current === true) {
            getUserInfo();
            isFirstRender.current = false;
        }
    }); // TODO: dont make this infinite

    /**
    * Have success message  disappear after 5 seconds
    */
    useEffect(() => {
        if (successful) {
            setTimeout(() => {
                setSuccessful(false);
            }, 5000);
        }
    }, [successful]);

    /* update email using enter/return key */
    const handleUpdateEmailEnter = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // reset all error messages at start of event
            setError(false);

            /* check valid email */
            if (!RegexUtil.isValidEmailFormat(newEmail)) {
                setMessage(INVALID_EMAIL_OR_PHONE_ERROR);
                setMessageColor(RED);
                setError(true);
                return;
            }

            try {
                await axios.put(putUrl, {
                    email: newEmail,
                }, {
                    headers: {
                        token:
                            auth
                    }
                });
                setMessage(SUCCESS_MESSAGE);
                setMessageColor(WHITE);
                setSuccessful(true);
            } catch (err) {
                setMessage(EXISTING_CREDENTIALS_ERROR);
                setMessageColor(RED);
                setError(true);
                console.log(err);
            }
            getUserInfo();
        }
    }

    // update email
    const updateEmail = async (e) => {
        e.preventDefault();
        // reset all error messages at start of event
        setError(false);

        /* check valid email */
        if (!RegexUtil.isValidEmailFormat(newEmail)) {
            setMessage(INVALID_EMAIL_OR_PHONE_ERROR);
            setMessageColor(RED);
            setError(true);
            return;
        }

        try {
            await axios.put(putUrl, {
                email: newEmail,
            }, {
                headers: {
                    token:
                        auth
                }
            });
            setMessage(SUCCESS_MESSAGE);
            setMessageColor(WHITE);
            setSuccessful(true);
        } catch (err) {
            setMessage(EXISTING_CREDENTIALS_ERROR);
            setMessageColor(RED);
            setError(true);
            console.log(err);
        }
        getUserInfo();
    };

    /* update phone using enter/return key */
    const handleUpdatePhoneEnter = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // reset all error messages at start of event
            setError(false);

            /* check valid username */
            if (!RegexUtil.isValidPhoneFormat(newNumber)) {
                setMessage(INVALID_EMAIL_OR_PHONE_ERROR);
                setMessageColor(RED);
                setError(true);
                return;
            }
            try {
                await axios.put(putUrl, {
                    phone: RegexUtil.stripNonDigits(newNumber),
                }, {
                    headers: {
                        token:
                            auth
                    }
                });
                setMessage(SUCCESS_MESSAGE);
                setMessageColor(WHITE);
                setSuccessful(true);
            } catch (err) {
                setMessage(EXISTING_CREDENTIALS_ERROR);
                setMessageColor(RED);
                setError(true);
                console.log(err);
            }
            getUserInfo();
        }
    }

    // update phone 
    const updatePhone = async (e) => {
        e.preventDefault();
        // reset all error messages at start of event
        setError(false);

        /* check valid username */
        if (!RegexUtil.isValidPhoneFormat(newNumber)) {
            setMessage(INVALID_EMAIL_OR_PHONE_ERROR);
            setMessageColor(RED);
            setError(true);
            return;
        }
        try {
            await axios.put(putUrl, {
                phone: RegexUtil.stripNonDigits(newNumber),
            }, {
                headers: {
                    token:
                        auth
                }
            });
            setMessage(SUCCESS_MESSAGE);
            setMessageColor(WHITE);
            setSuccessful(true);
        } catch (err) {
            setMessage(EXISTING_CREDENTIALS_ERROR);
            setMessageColor(RED);
            setError(true);
            console.log(err);
        }
        getUserInfo();
    };

    /* update phone using enter/return key */
    const handleUpdatePasswordEnter = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // reset all error messages at start of event
            setError(false);

            /* check valid username */
            if (!RegexUtil.isValidPasswordFormat(newPassword)) {
                setMessage(INVALID_PASSWORD_ERROR + RegexUtil.MIN_PASSWORD_LENGTH);
                setMessageColor(RED);
                setError(true);
                return;
            }
            try {
                await axios.put(putUrl, {
                    password: newPassword,
                }, {
                    headers: {
                        token:
                            auth
                    }
                });
                setMessage(SUCCESS_MESSAGE);
                setMessageColor(WHITE);
                setSuccessful(true);
            } catch (err) {
                console.log(err);
            }
            getUserInfo();
        }
    }

    // update password 
    const updatePassword = async (e) => {
        e.preventDefault();
        // reset all error messages at start of event
        setError(false);

        /* check valid username */
        if (!RegexUtil.isValidPasswordFormat(newPassword)) {
            setMessage(INVALID_PASSWORD_ERROR + RegexUtil.MIN_PASSWORD_LENGTH);
            setMessageColor(RED);
            setError(true);
            return;
        }
        try {
            await axios.put(putUrl, {
                password: newPassword,
            }, {
                headers: {
                    token:
                        auth
                }
            });
            setMessage(SUCCESS_MESSAGE);
            setMessageColor(WHITE);
            setSuccessful(true);
        } catch (err) {
            console.log(err);
        }
        getUserInfo();
    };

    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [newPassword, setNewPassword] = useState('');

    return (
        <div className="personalInfo">
            <Navbar />

            <div className="personalInfoForm">
                <div className="container">
                    <form>
                        <h1>Personal Info</h1>
                        <button type='button' className="infoButton">
                            {"Phone Number: "}
                            <span>
                                {
                                   number
                                }
                            </span>
                        </button>
                        <button type='button' className="infoButton">
                            {"Email: "}
                            <span>
                                {
                                    email
                                }
                            </span>
                        </button>
                        <button type='button' className="infoButton">Username: <span>{username}</span> </button>

                        <label>
                            <div className="infoType"> {"Change email: "}</div>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="input"
                                onKeyDown={handleUpdateEmailEnter}
                            />
                            <button onClick={updateEmail} className="formButton">Submit</button>
                        </label>

                        <label>
                            <div className="infoType"> {"Change phone number: "}</div>
                            <input
                                type="phone"
                                value={newNumber}
                                onChange={(e) => setNewNumber(e.target.value)}
                                className="input"
                                onKeyDown={handleUpdatePhoneEnter}
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
                                onKeyDown={handleUpdatePasswordEnter}
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

                        <Link to="/profPic" className="link">
                            <button className="button2">Edit profile picture </button>
                        </Link>

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
