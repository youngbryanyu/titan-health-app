/* This file represents the entry point for out node.js application*/
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const express = require("express");

/* Create instance of app */
const app = express();

/* Define REST API endpoint routes */
const usersRoute = require("./routes/users");

/* Configure .env (hidden env vars) */
dotenv.config();

/* Establish connection to MongoDB */
mongoose
    .connect( // connect to MongoDB database
        process.env.MONGO_URL, { // to hide DB credentials
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Successfully connected to MongoDB."))
    .catch(err => console.log(err));

/* Use express middleware to parse requests from frontend */
app.use(express.json());

/* Allow our app instance to use our API endpoints */
app.use("/api/users", usersRoute);

/* Have backend server listen on port 8000 on the local host */
const PORT = 8000;
app.listen(PORT, async () => {
    console.log(`Backend is running. Listening on port ${PORT}`);
});