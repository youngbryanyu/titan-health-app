/* REST API Route for users */
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/user");
const verify = require("../util/auth/verifyJWTToken");
const crypto = require('crypto')

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

/* PUT - add user food in tracker */
router.put('/addFood/:userId', verify, async (req, res) => {
  try {
    //TODO: add logic to reject duplicate foods
    const userId = req.params.userId;
    const { foodName, calories, fat, protein, carbohydrates, servings, mealType } = req.body;
    const hash = crypto.createHash('sha1').update(foodName).digest('hex');
    const newFood = {
      foodName: foodName || "[add name]",
      calories: calories || "[add calories]",
      fat: fat || "[add fat]",
      protein: protein || "[add protein]",
      carbohydrates: carbohydrates || "[add carbs]",
      servings: servings || "[add servings]",
      mealType: mealType || "[add meal type]",
      hash
    };

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.foods.push(newFood);

    // Save the updated user
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* PUT - edit user food in tracker */
router.put('/editFood/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { foodName, calories, fat, protein, carbohydrates, servings, mealType, hash } = req.body;
    const editedFood = {
      foodName: foodName || "[add name]",
      calories: calories || "[add calories]",
      fat: fat || "[add fat]",
      protein: protein || "[add protein]",
      carbohydrates: carbohydrates || "[add carbs]",
      servings: servings || "[add servings]",
      mealType: mealType || "[add meal type]",
      hash
    };

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const itemIndex = user.foods.findIndex((obj => obj.hash === hash));
    user.foods[itemIndex] = editedFood;

    // Save the updated user
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* PUT - update weight log */
router.put("/weight", verify, async (req, res) => {
  try {
    /* Find user matching the input user id */
    const user = await User.findById(req.body.userId);

    /* User doesn't exist case */
    if (!user) {
      res.status(404).json(`User not found`);
      return;
    }

    /* Write changes to database */
    const updatedWeight = await User.findByIdAndUpdate(user._id, {
      weightLog: req.body.weightLog
    }, { new: true });
    res.status(201).json("Weight was updated. " + updatedWeight);
  } catch (error) {
    res.status(500).json("Error updating weights. " + error);
  }
});

/* PUT - update water intake log */
router.put("/water", verify, async (req, res) => {
  try {
    /* Find user matching the input user id */
    const user = await User.findById(req.body.userId);

    /* User doesn't exist case */
    if (!user) {
      res.status(404).json(`User not found`);
      return;
    }

    /* Write changes to database */
    const updatedwaterIntakeLog = await User.findByIdAndUpdate(user._id, {
      waterIntakeLog: req.body.waterIntakeLog
    }, { new: true });
    res.status(201).json("waterIntakeLog was updated. " + updatedwaterIntakeLog);
  } catch (error) {
    res.status(500).json("Error updating water intake log. " + error);
  }
});

/* PUT - update sleep log */
router.put("/sleep", verify, async (req, res) => {
  try {
    /* Find user matching the input user id */
    const user = await User.findById(req.body.userId);

    /* User doesn't exist case */
    if (!user) {
      res.status(404).json(`User not found`);
      return;
    }

    /* Write changes to database */
    const updatedSleep = await User.findByIdAndUpdate(user._id, {
      sleepLog: req.body.sleepLog
    }, { new: true });
    res.status(201).json("Sleep was updated. " + updatedSleep);
  } catch (error) {
    res.status(500).json("Error updating sleep. " + error);
  }
});
/* PUT - update supplement log */
router.put("/supplements", verify, async (req, res) => {
  try {
    /* Find user matching the input user id */
    const user = await User.findById(req.body.userId);

    /* User doesn't exist case */
    if (!user) {
      res.status(404).json(`User not found`);
      return;
    }

    /* Write changes to database */
    const updatedSupplements = await User.findByIdAndUpdate(user._id, {
      supplementLog: req.body.supplementLog
    }, { new: true });
    res.status(201).json("Supplements were updated. " + updatedSupplements);
  } catch (error) {
    res.status(500).json("Error updating supplements. " + error);
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

/* GET - get all food items in tracker */
router.get('/allFoods/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all the food items
    return res.status(200).json(user.foods);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET - get a food item in tracker */
router.get('/aFoodItem/:userId/:hash', verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    const hash = req.params.hash;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const itemIndex = user.foods.findIndex((obj => obj.hash === hash));

    // Get all the food items
    return res.status(200).json(user.foods[itemIndex]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* ###################### 
########## DELETE ##########
######################### */

/* DELETE - Delete food item in tracker*/
router.delete('/deleteFood/:userId/:hash', verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    const hash = req.params.hash;
    const user = await User.findById(userId); // Find the user by ID

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const itemIndex = user.foods.findIndex((obj => obj.hash === hash));
    user.foods.splice(itemIndex, 1);

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* export module for external use */
module.exports = router;
