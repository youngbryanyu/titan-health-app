/* Code that renders homepage on the frontend */
import Navbar from "../../components/navbar/navbar";
import React from "react";
import "./home.scss";

/**
 * Returns a react component consisting of the Home page. Includes all logic relevant to the home page.
 * 
 * @returns a react component consisting of the Home page.
 */
const Home = () => {
    return (
        <div className="home">
            <Navbar />
            
            
            
            {/* <Footer /> */}
        </div>
    );
};

export default Home;