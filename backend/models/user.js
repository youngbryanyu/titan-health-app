/* Schema for a User in the Users Database */
const mongoose = require("mongoose");

/**
 * MongoDB schema representing all information pertaining to a specific user.
 */
const schema = new mongoose.Schema(
    {
        /* MongoDB default generates a globally unique _id field */
        
        /* Authentication */
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: false, default: false },

        /* Dining court */
        preferences: { type: [], required: false, default: [] },
        restrictions: { type: [], required: false, default: [] },
        favoriteMenuItems: { type: [], required: false, default: [] }, /* saved/favorite menu items are currently stored in their own collection */
        
        /* Food tracking and nutrition */
        foods: { type: [], required: false, default: [] }, /* foods in user's meal tracker */
        lowLevelNutritionGoals: { type: Map, of: String, required: false, 
            default: {
                calories: "2000",
                protein: "122",
                carbohydrates: "267",
                fat: "57"
            },
        },
        highLevelNutritionGoals: { type: [], required: false, default: [] },
        currentFoodPlan: { type: [], required: false, default: [] },
        favoriteFoodItems: { type: [], required: false, default: [] },

        /* Fitness */
        liftingLog: { type: [], required: false, default: [] },
        cardioLog: { type: [], required: false, default: [] },
        otherExerciseLog: { type: [], required: false, default: [] },
        favoriteExercises: { type: [], required: false, default: [] },
        lowLevelFitnessGoals: { type: [], required: false, default: [] },
        highLevelFitnessGoals: { type: [], required: false, default: [] },
        currentWorkoutPlan: { type: [], required: false, default: [] },
        physicalActivityRestrictions: { type: [], required: false, default: [] },

        /* Integrated Health Features */
        workdayRange: { type: [], required: false, default: [] },
        healthQuestionnaireAnswers: { type: [], required: false, default: [] },
        currentHealthPlan: { type: [], required: false, default: [] },

        /* Other Health Features */
        weightLog: { type: [], required: false, default: [] },
        waterIntakeLog: { type: [], required: false, default: [] },
        sleepLog: { type: [], required: false, default: [] },
        supplementLog: { type: [], required: false, default: [] },

        /* Social Features */
        friends: { type: [], required: false, default: [] },
        goals: { type: [], required: false, default: [] },
        favoriteExercise: { type: String, required: false, default: "none" },
        favoriteFood: { type: String, required: false, default: "none" },

        /* Notifications */
        optInRated: { type: Boolean, required: false, default: false }, 
        optInSaved: { type: Boolean, required: false, default: false }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", schema);

