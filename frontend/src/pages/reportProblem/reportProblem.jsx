/* React page for reporting problems */
import "./reportProblem.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../utils/authentication/auth-context";
import { useEffect, useRef, useContext, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import axios from "axios";
import RegexUtil from "../../utils/regex-util";
import ROUTES from "../../routes";

/**
 * Returns a react component consisting of the Report a problem page. Includes all logic relevant to reporting a proble.
 * 
 * @returns a react component consisting of the Report a problem page.
 */
export default function ReportProblem() {
    /* Message shown when message submits successfully */
    const SUBMIT_MESSAGE = "The problem was reported successfully!";

    /* Message shown when message submit fails */
    const ERROR_MESSAGE = "Cannot submit an empty problem message!";

    /* Problem message entered by user */
    const [problemMessage, setProblemMesssage] = useState("");

    /* Whether the problem message is valid */
    const [isValidProblemMessage, setIsValidProblemMessage] = useState(true);

    /* Whether the form was submitted successfully */
    const [submittedForm, setSubmittedForm] = useState(false);

    /* Get instance of user from auth context */
    const { user } = useContext(AuthContext); 
    const userId = user._id;

    /* Reference to the user box */
    const textBoxRef = useRef();

    /* Handles when user submits the form */
    const handleSubmit = async (e) => {
        /* Prevent default event behavior*/
        e.preventDefault();
        
        /* Check if error message is valid */
        if (!RegexUtil.isValidErrorMessage(problemMessage)) {
            setIsValidProblemMessage(false);
            return;
        }
        
        /* Make HTTP POST request to store problem in DB */
        setIsValidProblemMessage(true);
        try {
            await axios.post('problems', {
                userId: userId,
                problem: problemMessage
            }, {
                headers: {
                    token: "Bearer " + user.accessToken 
                }
            });
            setSubmittedForm(true);

            /* Set text box and error message to empty */
            textBoxRef.current.value = ''; 
            setProblemMesssage(""); 
        } catch (error) {
            console.log(error);
        }
        
    }

    /**
     * Have successfully submitted message disappear after 5 seconds
     */
    useEffect(() => {
        if (submittedForm) {
            setTimeout(() => {
                setSubmittedForm(false);
            }, 5000);
        }
    }, [submittedForm]);

    return (
        <div className="reportProblem">
            <div className="top">
                <Navbar />
            </div>
            <div className="reportProblemForm">
                <div className="container">
                    <div className="recentlyRegisteredMessage"> {/* recently submitted form message */}
                        <p style={{ visibility: !submittedForm && "hidden" }}>
                            {SUBMIT_MESSAGE}
                        </p>
                    </div>

                    <form>
                        <h1>Report a Problem</h1>
                        <textarea
                            maxLength="400"
                            placeholder="Type the problem here (400 characters max)..."
                            onChange={(e) => setProblemMesssage(e.target.value)}
                            ref={textBoxRef}
                        />
                        <div className="errorMessage"> {/* error message if invalid problem message (empty problem message) */}
                            <p className="errorMessage" style={{ visibility: isValidProblemMessage && "hidden" }}>
                                {ERROR_MESSAGE}
                            </p>
                        </div>
                        <button className="loginButton" onClick={handleSubmit}>Submit</button>


                        <Link to={ROUTES.SETTINGS} className="link">
                            <button className="backButton">Back</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}