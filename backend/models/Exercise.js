/* Schema for an Exercise in the exercises Database */
const mongoose = require("mongoose")

const schema = new mongoose.Schema(
{
    /* MongoDB default generates a globally unique _id field */

    /* below fields imported from exercises api */
    name: { type: String, required: true },
    exerciseType: { type: String, required: true },
    muscle: { type: String, required: true },
    equipment: { type: String, required: true },
    difficulty: { type: String, required: true },
    instructions: { type: String, required: true },
});

module.exports = mongoose.model("Exercise", schema);