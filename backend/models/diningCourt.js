/* Defines Schema in DB for a menu item */
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        formalName: { type: String },
        googleID: { type: String }, //google places id for future use
        mealInfo: {type: [Object] }, //{meal name, start time, end time}
        // mealInfo: {type: Object}, //{meal name, start time, end time}

        // caption: { type: String, required: true },
        // description: { type: String, required: true },
        // stations: { type: [String], required: true },
        // locationImg: { type: String, required: true },
        // menuItems: { type: [ItemSchema], required: true }
    }
);

module.exports = mongoose.model("DiningCourt", schema);