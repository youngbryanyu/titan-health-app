/* HTTP request REST API endpoints for authentication */
const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

/**
 * POST request to register and create new user.
 */
router.post("/register", async (req, res) => {
    /* Check if username, email, or phone number already used */
    const user = await User.findOne({
        $or: [
            { email: req.body.loginMethod },
            { phone: req.body.loginMethod },
            { username: req.body.loginMethod}
        ]
    });
    if (user) {
        console.log(JSON.stringify(user))
        res.status(403).json("The username, email, or phone number is already taken."); // if no matching email in DB
        return;
    }

    /* Create new user */
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString() /* encrypt password using AES */
    });

    /* Try saving new user to database */
    try {
        const user = await newUser.save();
        res.status(201).json(user); 
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

/**
 * POST request to login.
 */
router.post("/login", async (req, res) => {
    try {
        /* Try to find a user that matches the login method */
        const user = await User.findOne({ 
            $or: [
                { email: req.body.loginMethod },
                { phone: req.body.loginMethod },
                { username: req.body.loginMethod}
            ]
        });

        /* Invalid credentials, user not found */
        if (!user) {
            res.status(404).json("Invalid email, phone, or username"); // if no matching email in DB
            return;
        }
        
        /* Encrypt password entered, and compare with stored encrypted password */
        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        if (originalPassword !== req.body.password) {
            res.status(401).json("Wrong username or password!!"); // if incorrect password
            return;
        }

        /* Sign JWT token */
        const accessToken = jwt.sign( 
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "5d" }
        ); 
        // console.log(accessToken)
        
        /* Return info and access token to user, but don't return password */
        const { password, ...info } = user._doc; 
        res.status(200).json({ ...info, accessToken }); 
    } catch (err) {
        res.status(500).json(err);
    }
});

/* export module for external use */
module.exports = router;
