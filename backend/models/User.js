/* Schema for a User in the Users Database */
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        /* MongoDB default generates a globally unique _id field */
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        // TODO: finish schema
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", schema);

