/* REST API Route for users */
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/user");
const verify = require("../util/auth/verifyJWTToken");

/* ###################### 
########## PUT ##########
######################### */

/* PUT - update preferences */
router.put("/preferences", verify, async (req, res) => { 
    try {
        /* Find user matching the input user id */
        const user = await User.findById(req.body.userId);

        /* User doesn't exist case*/
        if (!user) {
            res.status(404).json(`User not found`);
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
router.put("/restrictions", verify, async (req, res) => { 
    try {
        /* Find user matching the input user id */
        const user = await User.findById(req.body.userId);

        /* User doesn't exist case */
        if (!user) {
            res.status(404).json(`User not found`);
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

/* PUT - update user personal information */
router.put("/personalInfo", verify, async (req, res) => { 
    if (req.user.id === req.body.id || req.user.isAdmin) {
        /* If user wants to change password, encrypt it before storing */
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString();
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.body.id,
                { 
                    $set: req.body /* update all parameters in the body */
                },
                { new: true } /* return updated user in the JSON response */
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only update your own account!");
    }
});

/* ###################### 
########## GET ##########
######################### */

// GET - get 1 user by their user ID
router.get("/find/:id", verify, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc; /* split password from user data --> return everything but password in JSON response */
        res.status(200).json(info); /* return everything but password in info */
    } catch (err) {
        res.status(500).json(err);
    }
});

/* GET - get preferences */
router.get("/preferences/:userId", verify, async (req, res) => {
    try {
        /* Find user matching the input user id */
        const user = await User.findById(req.params.userId);

        /* Return user preferences */
        const result = user.preferences;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json("Error retriving preferences. " + error);
    }
});

/* GET - get restrictions */
router.get("/restrictions/:userId", verify, async (req, res) => {
    try {
        /* Find user matching the input user id */
        const user = await User.findById(req.params.userId);

        /* Return user restrictions */
        const result = user.restrictions;
        res.status(200).json(result); 
    } catch (error) {
        res.status(500).json("Error retriving preferences. " + error);
    }
});

/* export module for external use */
module.exports = router;