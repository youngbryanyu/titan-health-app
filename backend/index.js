/* This file represents the entry point for out node.js application*/
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const express = require("express");
const schedule = require("node-schedule");

/* Create instance of app */
const app = express();

/* Define REST API endpoint routes */
const authenticationRoute = require("./routes/auth");
const menuInfoRoute = require("./routes/menuInfo");
const recommendationsRoute = require("./routes/recommendations");
const problemsRoute = require("./routes/problem");
const ratingsRoute = require("./routes/ratings");
const savedRoute = require("./routes/saved");
const usersRoute = require("./routes/users");


/* Configure .env (hidden env vars) */
dotenv.config();

/* Establish connection to MongoDB */
mongoose
    .connect( 
        process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Successfully connected to MongoDB."))
    .catch(err => console.log(err));

/* Use express middleware to parse requests from frontend */
app.use(express.json());

/* Allow our app instance to use our API endpoints */
app.use("/api/auth", authenticationRoute);
app.use("/api/menuInfo", menuInfoRoute);
app.use("/api/problems", problemsRoute);
app.use("/api/ratings", ratingsRoute); 
app.use("/api/recommendations", recommendationsRoute); 
app.use("/api/saved", savedRoute);
app.use("/api/users", usersRoute);

/* Have backend server listen on port 8000 on the local host */
const PORT = 8000;
app.listen(PORT, async () => {
    console.log(`Backend is running. Listening on port ${PORT}`);
    console.log("Attempting to connect to MongoDB.");

    /* Uncomment this to immediately parse new dining data on server startup */
    // try {
    //     await axios.post('http://localhost:8000/api/menuInfo/load');
    // } catch (error) {
    //     console.log("ERROR PARSING DINING DATA ON STARTUP: " + error);
    // }

    /* Uncomment this to immediately reset all users' food trackers on server startup */
    // try {
    //     await axios.delete('http://localhost:8000/api/users/resetTrackers');
    // } catch (error) {
    //     console.log("ERROR RESETTING TRACKER AT MIDNIGHT: " + error);
    // }
});

/* Schedule jobs to run every midnight scheduler uses CRON formatting: https://crontab.guru/every-night-at-midnight */
schedule.scheduleJob('0 0 * * *', async () => {
    /* Parse dining data everyday at 12:00 am */
    try {
        await axios.post('http://localhost:8000/api/menuInfo/load');
    } catch (error) {
        console.log("ERROR PARSING DINING DATA AT MIDNIGHT: " + error);
    }
    
    /* Reset user's trackers everyday at 12 am */
    try {
        await axios.delete('http://localhost:8000/api/users/resetTrackers');
    } catch (error) {
        console.log("ERROR RESETTING TRACKER AT MIDNIGHT: " + error);
    }
});
