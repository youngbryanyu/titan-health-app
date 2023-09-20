/* Schema for a meal in the meals database */
const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        /* MongoDB default generates a globally unique _id field */
        name: { type: String, required: true },
        foodItems: { type: [], required: true }, //array of food item ids
        creator: { type: String, required: true }, //username of creator
        isVegetarian: { type: Boolean, required: false },
        allergens: { type: [], required: false },//restrictions/preferences
        nutritionFacts: { type: [], required: true },//aggregated nutrition facts of all food items in meal 
        ratings: { type: [{
            username: String,
            rating: Number
        }], required: false }, //keep ratings as an array of tuples (username, rating)
        avgRating: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Meal", schema); 