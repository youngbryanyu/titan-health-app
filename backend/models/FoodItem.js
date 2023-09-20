/* Schema for a food item in the food items database */
const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        /* MongoDB default generates a globally unique _id field */
        name: { type: String, required: true },
        serveData: {
            type: [{ //if this doesnt work just do serveData: {type: [Object]}
                diningCourt: String,
                timeServed: Date //String might work better, Date stores date and time
            }], required: false
        },
        isVegetarian: { type: Boolean, required: false },
        allergens: { type: [], required: false },
        nutritionFacts: { type: [], required: false },
        ingredients: { type: String, required: false },
        ratings: { type: [{username: String, rating: Number}], required: false }, //keep ratings as an array of tuples (username, rating)
        avgRating: { type: Number, default: 0 }
    }
);
module.exports = mongoose.model("FoodItem", schema); 