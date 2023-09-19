/* Root component of react app */
import "./app.scss"
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext/AuthContext";

const App = () => {
    const { user } = useContext(AuthContext); // get user from auth context

    return (
        <Router>
            <Routes>
                { /* Paths for when user is LOGGED IN */
                    user && (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Home />} /> {/* Should go to home when logged in */}
                        </>
                    )
                }
                { /* Paths for when user is NOT LOGGED IN */
                    !user && (
                        <>
                        <Route path="/" element={<Home />} /> { /* remove this line and uncomment below after login is implemented */}
                            {/* <Route path="/" element={<Register />} /> */}
                            {/* <Route path="/login" element={<Login />} /> */}
                        </>
                    )
                }
            </Routes>
        </Router>
    );
};

export default App;

