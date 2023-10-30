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

/* PUT - add to weight log */
router.put("/weight/:userId", verify, async (req, res) => {
  try {
    // Get user by ID
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const { weight, date } = req.body;
    const newEntry = {
      weight: weight || "[add weight]",
      date: date || "[add date]"
    };

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.weightLog.push(newEntry);

    // Save the updated user
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error making new weight entry: " + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* PUT - add to water log */
router.put("/water/:userId", verify, async (req, res) => {
  try {
    // Get user by ID
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const { intake, date } = req.body;
    const newEntry = {
      intake: intake || "[add water intake]",
      date: date || "[add date]"
    };
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.waterIntakeLog.push(newEntry);
    
    // Save the updated user
    await user.save();

    return res.status(200).json(user);
    
    } catch (error) {
      console.error("Error making new water intake entry: " + error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* PUT - add exercise in tracker */
router.put('/addExercise/:userId', verify, async (req, res) => {
  try {
    //TODO: add logic to reject duplicate exercises
    const userId = req.params.userId;
    const { exerciseName, sets, reps, time, exerciseType } = req.body;
    const hash = crypto.createHash('sha1').update(exerciseName).digest('hex');
    const newExercise = {
      exerciseName: exerciseName || "[add name]",
      sets: sets || (exerciseType === "Cardio" ? "N/A" : "[add sets]"),
      reps: reps || (exerciseType === "Cardio" ? "N/A" : "[add reps]"),
      time: time || "[add time]",
      exerciseType: exerciseType || "[add exercise type]",
      hash
    };

    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    exerciseType === "Weight Lifting" ? user.liftingLog.push(newExercise) : user.cardioLog.push(newExercise);
    user.otherExerciseLog.push(newExercise);
    
    // Save the updated user
    await user.save();

    return res.status(200).json(user);
    
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* PUT - edit user food in tracker */
router.put('/editExercise/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { exerciseName, sets, reps, time, exerciseType, hash } = req.body;
    const editedExercise = {
      exerciseName: exerciseName,
      sets: sets,
      reps: reps,
      time: time,
      exerciseType: exerciseType,
      hash: hash
  };

    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    let itemIndex;

    if (exerciseType === "Weight Lifting") {
      itemIndex = user.liftingLog.findIndex((obj => obj.hash === hash));
      user.liftingLog[itemIndex] = editedExercise;
    } else {
      itemIndex = user.cardioLog.findIndex((obj => obj.hash === hash));
      user.cardioLog[itemIndex] = editedExercise;
    }
    
    // Save the updated user
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* PUT - add to sleep log */
router.put("/sleep/:userId", verify, async (req, res) => {
  //TODO: disallow duplicate dates
  try {
    // Get user by ID
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const { length, date } = req.body;
    const newEntry = {
      length: length || "[add amount]",
      date: date || "[add date]"
    };
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.sleepLog.push(newEntry);

    // Save the updated user
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error making new sleep entry: " + error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* PUT - add to supplement log */
router.put("/supplement/:userId", verify, async (req, res) => {
  //TODO: disallow duplicate dates
  try {
    // Get user by ID
    const userId = req.params.userId;
    const user = await User.findById(userId);

    const { supplement, amount, date } = req.body;
    const newEntry = {
      supplement: supplement || "[add supplement]",
      amount: amount || "[add amount]", 
      date: date || "[add date]"
    };

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.supplementLog.push(newEntry);
    
    // Save the updated user
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error making new supplement entry: " + error);
    return res.status(500).json({ error: 'Internal Server Error' });
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

/* GET - get weights in log */
router.get('/weights/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all the requisite items
    return res.status(200).json(user.weightLog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET - get sleep in log */
router.get('/sleep/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all the requisite items
    return res.status(200).json(user.sleepLog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET - get water intake in log */
router.get('/water/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all the requisite items
    return res.status(200).json(user.waterIntakeLog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET - get supplements in log */
router.get('/supplement/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all the requisite items
    return res.status(200).json(user.supplementLog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* ###################### 
########## DELETE ##########
######################### */

/* DELETE - Delete food item in tracker*/
router.delete('/deleteFood/:userId/:foodName', verify, async (req, res) => {
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

/* GET - get all weight lifting exercises in tracker */
router.get('/allLifting/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all the food items
    return res.status(200).json(user.liftingLog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET - get all cardio exercises in tracker */
router.get('/allCardio/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all the food items
    return res.status(200).json(user.cardioLog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET - get an exercise from tracker */
router.get('/anExercise/:userId/:hash', verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    const hash = req.params.hash;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const itemIndex = user.liftingLog.findIndex((obj => obj.hash === hash));
    const itemIndex2 = user.cardioLog.findIndex((obj => obj.hash === hash));

    return itemIndex == -1 ? res.status(200).json(user.cardioLog[itemIndex2]) : res.status(200).json(user.liftingLog[itemIndex]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET - get an old exercise from tracker */
router.get('/priorExercise/:userId/:name', verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    const name = req.params.name;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const itemIndex = user.otherExerciseLog.findIndex((obj => obj.exerciseName === name));

    return itemIndex == -1 ? res.status(200).json("No Prior History") : res.status(200).json(user.otherExerciseLog[itemIndex]);

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
  
/* DELETE - Delete exercise in tracker*/
router.delete('/deleteExercise/:userId/:hash', verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    const hash = req.params.hash;
    const user = await User.findById(userId); // Find the user by ID

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const itemIndex = user.liftingLog.findIndex((obj => obj.hash === hash));
    const itemIndex2 = user.cardioLog.findIndex((obj => obj.hash === hash));
    if(itemIndex != -1) user.liftingLog.splice(itemIndex, 1);
    else user.cardioLog.splice(itemIndex2, 1);

    // Save the updated user
    await user.save();
    
    return res.status(200).json({ message: 'Exercise deleted successfully' });
    
    } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* export module for external use */
module.exports = router;
