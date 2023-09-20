/* Schema for a workout in the workouts database */
const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        /* MongoDB default generates a globally unique _id field */
        name: { type: String, required: true },
        exercises: { type: [], required: true }, //array of constituent exercises
        creator: { type: String, required: true }, //username of creator
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Workout", schema); 