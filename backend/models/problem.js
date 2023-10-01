/* Defines Schema in DB for a reported problem */
const mongoose = require("mongoose");

/**
 * MongoDB schema representing all information pertaining to a problem reported by a user.
 */
const schema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        problem: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Problem", schema);