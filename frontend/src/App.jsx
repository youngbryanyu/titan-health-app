/* Root component of react app */
import "./app.scss"
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext/AuthContext";

const App = () => {
    /* Get user from authentication context */
    const { user } = useContext(AuthContext);

    /* Page routes for when used is logged in */
    const LOGGED_IN_ROUTES = (
        <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Home />} />
        </>
    );

    /* Page routes for when use is logged out */
    const LOGGED_OUT_ROUTES = (
        <>
            <Route path="/" element={<Home />} />
            {/* Uncomment these lines after login is implemented */}
            {/* 
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            */}
        </>
    );

    return (
        <Router>
            <Routes>
                {user ? LOGGED_IN_ROUTES : LOGGED_OUT_ROUTES}
            </Routes>
        </Router>
    );
};

export default App;
