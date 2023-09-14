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
// TODO: implement

/* Use express middleware to parse requests from frontend */
app.use(express.json());

/* Allow our app instance to use our API endpoints */
app.use("/api/users", usersRoute);