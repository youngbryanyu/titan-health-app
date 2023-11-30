/* Defines Schema in DB for a saved menu item */
const mongoose = require("mongoose");

const schema = new mongoose.Schema( 
    {
        userId: { type: String, required: true },   
        menuItemID: { type: String, required: true },
        saved: { type: Boolean, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Saved", schema);