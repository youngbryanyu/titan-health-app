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
    const { foodName, calories, fat, protein, carbohydrates, servings, servingSize, mealType } = req.body;
    let hash = crypto.createHash('sha1').update(foodName).digest('hex');
    hash += Math.floor(Date.now() / 1000).toString(); // salt the hash with current time.

    const newFood = {
      foodName: foodName || "[No name]",
      calories: calories || 0,
      fat: fat || 0,
      protein: protein || 0,
      carbohydrates: carbohydrates || 0,
      servings: servings || 0,
      servingSize: servingSize || "[unknown serving size]",
      mealType: mealType || "[no meal type]",
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
    const { foodName, calories, fat, protein, carbohydrates, servings, servingSize, mealType, hash } = req.body;
    const editedFood = {
      foodName: foodName || "[add name]",
      calories: calories || "[add calories]",
      fat: fat || "[add fat]",
      protein: protein || "[add protein]",
      carbohydrates: carbohydrates || "[add carbs]",
      servings: servings || "[add servings]",
      servingSize: servingSize || "[add serving size]",
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
    let hash = crypto.createHash('sha1').update(exerciseName).digest('hex');
    const d = new Date();
    //hash += "*" + "2023-10-24";  //only used to add exercises to a specific month
    hash += "*" + d.toISOString().split('T')[0]; //add data in yyyy-mm-dd format
    const newExercise = {
      exerciseName: exerciseName || "[add name]",
      sets: sets || (exerciseType === "Cardio" || "Other" ? "N/A" : "[add sets]"),
      reps: reps || (exerciseType === "Cardio" || "Other" ? "N/A" : "[add reps]"),
      time: time || "[add time]",
      exerciseType: exerciseType || "[add exercise type]",
      hash
    };

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (exerciseType === "Weight Lifting") user.liftingLog.push(newExercise);
    else if (exerciseType === "Cardio") user.cardioLog.push(newExercise);
    else user.otherExerciseLog.push(newExercise);
    
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
    } else if (exerciseType === "Cardio") {
      itemIndex = user.cardioLog.findIndex((obj => obj.hash === hash));
      user.cardioLog[itemIndex] = editedExercise;
    } else {
      itemIndex = user.otherExerciseLog.findIndex((obj => obj.hash === hash));
      user.otherExerciseLog[itemIndex] = editedExercise;
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

/* PUT - save activity info */
router.put('/saveActivityInfo/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { activityLevel, lifestyle } = req.body;
    const newActivityInfo = {
      activityLevel: activityLevel || "[add activityLevel]",
      lifestyle: lifestyle || "[add lifestyle]"
    };

    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.physicalActivityRestrictions.length == 0) {
      user.physicalActivityRestrictions.push(newActivityInfo);
    } else {
      user.physicalActivityRestrictions[0] = newActivityInfo;
    }
    
    // Save the updated user
    await user.save();

    return res.status(200).json(user.physicalActivityRestrictions);
    
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* PUT - add to low level nutetion */
router.put("/nutrition/:userId", verify, async (req, res) => {
    const userId = req.params.userId;
    const { newEntry } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      // User doesn't exist case
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Extract existing lowLevelNutritionGoals from the user
      const { lowLevelNutritionGoals } = user;
  
      // Create a new Map with the existing values
      const updatedLowLevelNutritionGoals = new Map([...lowLevelNutritionGoals]);
  
      // Check if newEntry is present before iterating over its keys
      if (newEntry && typeof newEntry === 'object') {
        // Update or add values from the new entry
        Object.keys(newEntry).forEach(key => {
          updatedLowLevelNutritionGoals.set(key, newEntry[key]);
        });
      } else {
        return res.status(400).json({ error: 'Invalid request body' });
      }
  
      // Update the user's lowLevelNutritionGoals
      user.lowLevelNutritionGoals = updatedLowLevelNutritionGoals;
  
      // Save the updated user
      const updatedUser = await user.save();
  
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating nutrition goals:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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

/* other health features */
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

/* GET - get all other exercises in tracker */
router.get('/allOther/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let d = new Date();
    let date = d.toISOString().split('T')[0];
 
    // Get all other exercises from today
    return res.status(200).json(user.otherExerciseLog.filter((exercise) => exercise.hash.split('*')[1] === date));
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
  
      let d = new Date();
      let date = d.toISOString().split('T')[0];

      // Get all lifting exercises from today
      return res.status(200).json(user.liftingLog.filter((exercise) => exercise.hash.split('*')[1] === date));
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

      let d = new Date();
      let date = d.toISOString().split('T')[0];

      // Get all cardio exercises from today
      return res.status(200).json(user.cardioLog.filter((exercise) => exercise.hash.split('*')[1] === date));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});


/* GET - get all other exercises in tracker */
router.get('/allOther/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    let d = new Date();
    let date = d.toISOString().split('T')[0];
 
    // Get all other exercises from today
    return res.status(200).json(user.otherExerciseLog.filter((exercise) => exercise.hash.split('*')[1] === date));
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET - get activity info */
router.get('/activityInfo/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get users activity info
    return res.status(200).json(user.physicalActivityRestrictions);
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
    const itemIndex3 = user.otherExerciseLog.findIndex((obj => obj.hash === hash));

    if (itemIndex != -1) return res.status(200).json(user.liftingLog[itemIndex]);
    else if (itemIndex2 != -1) return res.status(200).json(user.cardioLog[itemIndex2]);
    else return res.status(200).json(user.otherExerciseLog[itemIndex3]);

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

    const allExercise = user.liftingLog.concat(user.cardioLog).concat(user.otherExerciseLog);
    const itemIndex = allExercise.findIndex((obj => obj.exerciseName === name)); 

    return itemIndex == -1 ? res.status(200).json("No Prior History") : res.status(200).json(allExercise[itemIndex]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET - get counts of exercises per month */
router.get('/exercisesPerMonth/:userId', verify, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let allExercises = user.cardioLog.concat(user.liftingLog).concat(user.otherExerciseLog);

    for (let i = 0; i < allExercises.length; i++) {

      if (allExercises[i].hash != null && allExercises[i].hash.split('*').length == 2) {
        let month = allExercises[i].hash.split('*')[1].split("-")[1];
        counts[parseInt(month) - 1]++;
      } 

    }

    // Get counts of exercises
    return res.status(200).json(counts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
    
  /*GET - low level nutrtion facts */
  router.get('/nutrition/:userId', verify, async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user.lowLevelNutritionGoals);
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
    const user = await User.findById(userId);
    const hash = req.params.hash;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // delete food item
    const itemIndex = user.foods.findIndex((obj => obj.hash === hash));
    user.foods.splice(itemIndex, 1);
    await user.save();

    return res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* DELETE - Delete all food items in a single user's tracker */
// router.delete('/deleteFood/:userId', verify, async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const user = await User.findById(userId);
  
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       // delete food item
//       user.foods = [];
//       await user.save();
  
//       return res.status(200).json({ message: 'All food items deleted successfully' });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

/* DELETE - Delete all food items in tracker */
router.delete('/resetTrackers', async (req, res) => { /* skip JWT token for now so that server can call this without being a user */
    try {
      const users = await User.find();
  
      if (!users) {
        return res.status(404).json({ error: 'User not found' });
      }
     
      // loop through each user and clear their food tracker
      for (let user of users) {
        const id = user._id;
        await User.findByIdAndUpdate(id, {
            foods: []
        })
      }

      // Print success message and return response to client
      console.log("Successfully deleted all food trackers for all users.");
      return res.status(200).json({ message: 'All food items deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

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
    const itemIndex3 = user.otherExerciseLog.findIndex((obj => obj.hash === hash));

    if (itemIndex != -1) user.liftingLog.splice(itemIndex, 1);
    else if (itemIndex2 != -1) user.cardioLog.splice(itemIndex2, 1);
    else user.otherExerciseLog.splice(itemIndex3, 1);

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
