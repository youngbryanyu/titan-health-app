/* Defines Schema in DB for a rating of a menu item */
const mongoose = require("mongoose");

const schema = new mongoose.Schema( // create schema for ratings in DB
    {
        userId: { type: String, required: true },   
        menuItemID: { type: String, required: true },
        rating: { type: Number, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rating", schema);