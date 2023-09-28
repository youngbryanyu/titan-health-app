/* REST API Route for users */
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/users");

// UPDATE - update preferences
router.post("/preferences", async (req, res) => { 
    try {
        // if entry for user already exists, update existing entry instead of creating new entry
        const preferences = await User.findOne({
            username: req.body.username
        });
        if (preferences) {
            const updatedPreferences = await User.findByIdAndUpdate(preferences._id, {
                preferences: req.body.preferences
            }, { new: true });
            res.status(201).json("Preferences were updated." + updatedPreferences);
            return;
        } else {
            // save preferences to database
            const newPreferences = await new User({
                username: req.body.username,
                preferences: req.body.preferences
            }).save();

            res.status(201).json("New preferences were saved: " + newPreferences);
            return;
        }
    } catch (error) {
        res.status(500).json(error);
        console.log("error writing preferences: " + error);
    }
});


// UPDATE - update restrictions
router.post("/restrictions", async (req, res) => { 
    try {
        // if entry for user already exists, update existing entry instead of creating new entry
        const restrictions = await User.findOne({
            username: req.body.username
        });
        if (restrictions) {
            const updatedRestrictions = await User.findByIdAndUpdate(restrictions._id, {
                restrictions: req.body.restrictions
            }, { new: true });
            res.status(201).json("Restrictions were updated." + updatedRestrictions);
            return;
        } else {
            // save restricitons to database
            const newRestrictions = await new User({
                username: req.body.username,
                restrictions: req.body.restrictions
            }).save();

            res.status(201).json("New restrictions were saved: " + newRestrictions);
            return;
        }
    } catch (error) {
        res.status(500).json(error);
        console.log("error writing restrictions: " + error);
    }
});

// GET - get preferences
router.get("/preferences/:username", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        });

        const result = user.preferences;
        console.log(result)
        res.status(200).json(result); // return prefs
    } catch (error) {
        res.status(500).json("Error retriving preferences (user likely doesn't have any yet):" + error);
    }
});

// GET - get restrictions
router.get("/restrictions/:username", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        });

        const result = user.restrictions;
        res.status(200).json(result); // return prefs
    } catch (error) {
        res.status(500).json("Error retriving preferences (user likely doesn't have any yet):" + error);
    }
});



/* export module for external use */
module.exports = router;