/* Schema for a user-submitted problem */
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        /* MongoDB default generates a globally unique _id field */
        username: { type: String, required: true }, //can be username or user id
        problem: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Problem", schema); 