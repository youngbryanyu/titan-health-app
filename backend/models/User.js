/* Schema for a User in the Users Database */
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        /* MongoDB default generates a globally unique _id field */
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        preferences: { type: [], required: false },

        /* all below are id arrays */
        favExercises: { type: [], required: false },
        favItems: { type: [], required: false },
        savedWorkouts: { type: [], required: false },
        savedMeals: { type: [], required: false },
        createdWorkouts: { type: [], required: false }, 
        createdMeals: { type: [], required: false }, 

        optInRated: { type: Boolean, required: true }, //notification switches
        optInSaved: { type: Boolean, required: true }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", schema);

