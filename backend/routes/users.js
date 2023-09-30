/* REST API Route for users */
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/users");

/* PUT - update preferences */
router.put("/preferences", async (req, res) => { 
    try {
        /* Find user matching the input username */
        const user = await User.findOne({
            username: req.body.username
        });

        /* User doesn't exist case*/
        if (!user) {
            res.status(404).json(`User ${req.body.username} not found`);
            return;
        }
        
        /* Write changes to database */
        const updatedPreferences = await User.findByIdAndUpdate(user._id, {
            preferences: req.body.preferences
        }, { new: true });
        res.status(201).json("Preferences were updated." + updatedPreferences);
    } catch (error) {
        res.status(500).json(error);
        console.log("Error updating user preferences. " + error);
    }
});


/* PUT - update restrictions */
router.put("/restrictions", async (req, res) => { 
    try {
        /* Find user matching the input username */
        const user = await User.findOne({
            username: req.body.username
        });

        /* User doesn't exist case*/
        if (!user) {
            res.status(404).json(`User ${req.body.username} not found`);
            return;
        }

        /* Write changes to database */
        const updatedRestrictions = await User.findByIdAndUpdate(user._id, {
            restrictions: req.body.restrictions
        }, { new: true });
        res.status(201).json("Restrictions were updated. " + updatedRestrictions);
    } catch (error) {
        res.status(500).json("Error updating restrictions. " + error);
    }
});

/* GET - get preferences */
router.get("/preferences/:username", async (req, res) => {
    try {
        /* Find user matching the input username */
        const user = await User.findOne({
            username: req.params.username
        });

        /* Return user preferences */
        const result = user.preferences;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json("Error retriving preferences. " + error);
    }
});

/* GET - get restrictions */
router.get("/restrictions/:username", async (req, res) => {
    try {
        /* Find user matching the input username */
        const user = await User.findOne({
            username: req.params.username
        });

        /* Return user restrictions */
        const result = user.restrictions;
        res.status(200).json(result); 
    } catch (error) {
        res.status(500).json("Error retriving preferences. " + error);
    }
});

/* export module for external use */
module.exports = router;