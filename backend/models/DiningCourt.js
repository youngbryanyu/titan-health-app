/* Schema for a Dining Court in the Dining courts Database */
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        /* MongoDB default generates a globally unique _id field */
        name: { type: String, required: true, unique: true },
        formalName: { type: String },
        googleID: { type: String }, //google places id for future use
        mealInfo: { type: [{
            mealName: String,
            startTime: Date,
            endTime: Date //types are tentative
        }] }, //{meal name, start time, end time}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("DiningCourt", schema);