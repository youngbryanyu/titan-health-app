const router = require("express").Router();
const fetch = require('node-fetch');
const MenuItem = require('../models/menuItem');
const DiningCourt = require('../models/diningCourt')
const User = require("../models/user");

const DINING_COURTS = ["Earhart", "Ford", "Hillenbrand", "Wiley", "Windsor"];
const PURDUE_DINING_API_URL_MENU_ITEMS = "https://api.hfs.purdue.edu/menus/v2/items/";
const PURDUE_DINING_API_URL_DINING_COURTS = "https://api.hfs.purdue.edu/menus/v2/locations/";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const POPULAR_RATING_THRESHOLD = 3; // items >= 3 stars are considered "popular"
// const MIN_NUM_RATINGS_POPULAR = 2; // min number of ratings for an item to be popular

// LOAD - load menus site for current day
router.post("/load", async (req, res) => { // use async/await to ensure request is fulfilled before writing to DB
    var d = new Date();
    var today = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    var todayDay = d.getDay();
    try { //parse outer xml
        const response = await fetch(PURDUE_DINING_API_URL_DINING_COURTS);
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const json = await response.json(); // outer information stored in outer json
        //debug: console.log(outerJson);
        //iterate through locations listed in dining url
        //structure: court -> day -> meal
        for (var court of json.Location) {
            //if not a court in DINING_COURTS, skip
            if (!(DINING_COURTS.find(courtname => (courtname === court.Name)))) {
                continue
            }
            var name = court.Name
            const formalName = court.FormalName
            const placeID = String(court.GooglePlaceId)
            var mealInfo = [] //[{meal name, start time, end time}]
            //populate mealInfo array
            for (var day of court.NormalHours[0].Days) {
                //only select today's day, disregard other days
                if (day.Name !== DAYS[todayDay]) {
                    continue
                }
                //for each meal today calculate start and end times, convert to 12-hour format, and add suffix
                for (var meal of day.Meals) {
                    var type = meal.Name
                    var start = meal.Hours.StartTime
                    var end = meal.Hours.EndTime
                    var sh = start.split(":")[0]
                    var eh = end.split(":")[0]
                    var sm = start.split(":")[1]
                    var em = end.split(":")[1]
                    var startSuffix = sh >= 12 ? " PM" : " AM"
                    var endSuffix = eh >= 12 ? " PM" : " AM"
                    var mealstart = ((sh % 12) || 12) + ":" + sm + startSuffix
                    var mealend = ((eh % 12) || 12) + ":" + em + endSuffix

                    var curmealinfo = {
                        mealType: type,
                        start: mealstart,
                        end: mealend,
                    }
                    console.log(curmealinfo)
                    mealInfo.push(curmealinfo)
                    // type contains final meal type
                    // mealstart contains this meal's start time, mealend contains end time
                }
            }
            // create object and push

            // name contains court name
            // formalName contains court's formal name
            // mealInfo contains objects denoting meals start/end times
            // googleID contains google place API key
            try {
                const diningCourtObj = await DiningCourt.findOne({
                    name: name
                });
                if (diningCourtObj) { // if menu item already exists, update it with possibly new information
                    await DiningCourt.findByIdAndUpdate(diningCourtObj._id, {
                        name: name,
                        formalName: formalName,
                        googleID: placeID,
                        mealInfo: mealInfo,
                    });
                    console.log("Updated dining court - " + name);
                } else {// create new MenuItem for current menu item
                    const newDiningCourt = new DiningCourt({
                        name: name,
                        formalName: formalName,
                        googleID: placeID,
                        mealInfo: mealInfo,
                    });

                    const newcourt = await newDiningCourt.save();
                    // res.status(201).json(item); //return item in DB response to JSON
                    console.log("Added dining court - " + name);
                }
            } catch (err) {
                console.log("Error occured while parsing and saving dining court information");
                console.log(err)
            }
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
        return;
    }


    var d = new Date();
    var today = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    var todayDate = new Date(today);

    // Parse dining items for each dining court
    for (const diningCourt of DINING_COURTS) {
        const outerUrl = PURDUE_DINING_API_URL_DINING_COURTS + diningCourt + "/" + today;
        try {
            const outerResponse = await fetch(outerUrl);
            if (!outerResponse.ok) {
                throw new Error(`Error! status: ${outerResponse.status}`);
            }
            const outerJson = await outerResponse.json(); //outer information stored in outer json
            // debug: console.log(outerJson);    
            //iterate through keys and parse
            for (const meal of outerJson.Meals) {
                const type = meal.Type;
                for (const station of meal.Stations) {
                    const stationname = station.Name;
                    for (const item of station.Items) {
                        const parseUrl = PURDUE_DINING_API_URL_MENU_ITEMS + item.ID;

                        // console.log(parseUrl)
                        const response = await fetch(parseUrl);
                        if (!response.ok) {
                            throw new Error(`Error! status: ${response.status}`)
                        }

                        const json = await response.json();

                        const courtdata = [diningCourt, stationname, type]

                        try {
                            const menuItem = await MenuItem.findOne({
                                ID: json.ID
                            });

                            /* if menu item date is different, reset court data and update info */
                            if (menuItem && menuItem.dateServed.getTime() != todayDate.getTime()) {
                                await MenuItem.findByIdAndUpdate(menuItem._id, {
                                    ID: json.ID,
                                    name: json.Name,
                                    courtData: [courtdata],
                                    dateServed: today,
                                    isVegetarian: json.IsVegetarian,
                                    allergens: json.Allergens,
                                    nutritionFacts: json.Nutrition,
                                    ingredients: json.Ingredients,
                                    avgRating: json.avgRating
                                })
                            } else if (menuItem) { // if menu item already exists, update it with possibly new information
                                await MenuItem.findByIdAndUpdate(menuItem._id, { $addToSet: { courtData: courtdata } }, { /* use addToSet to prevent duplicates */
                                    ID: json.ID,
                                    name: json.Name,
                                    dateServed: today,
                                    isVegetarian: json.IsVegetarian,
                                    allergens: json.Allergens,
                                    nutritionFacts: json.Nutrition,
                                    ingredients: json.Ingredients,
                                    avgRating: json.avgRating
                                });
                                console.log("Updated menu item - " + diningCourt + ": " + json.Name);
                            } else { // create new MenuItem for current menu item
                                const newMenuItem = new MenuItem({
                                    ID: json.ID,
                                    name: json.Name,
                                    courtData: [courtdata],
                                    dateServed: today,
                                    isVegetarian: json.IsVegetarian,
                                    allergens: json.Allergens,
                                    nutritionFacts: json.Nutrition,
                                    ingredients: json.Ingredients,
                                    avgRating: 0
                                });

                                const item = await newMenuItem.save();
                                //menuItems.push(item) // push to menu (taken out for now)
                                // res.status(201).json(item); //return item in DB response to JSON
                                console.log("Added menu item - " + diningCourt + ": " + json.Name);
                            }
                        } catch (err) {
                            // res.status(500).json(err);
                            console.log("Error occured while parsing and saving data: " + err);
                        }
                    }
                }

            }
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
            return;
        }
    }
    res.status(201).json("Dining court data was parsed successfully for " + today);
    console.log("Dining court data was parsed successfully for " + today);
});



// this gets all items from today regardless of dining court given the prefs and rests
router.post("/prefsAndRests", async (req, res) => {
    var d = new Date();
    var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());

    try {

        const rests = req.body.restrictions; //for example could be - "Coconut", "Peanuts"
        const prefs = req.body.preferences; //for example could be - "Vegan"
        const menuItems = await MenuItem.find({
            dateServed: today,
        });

        if (!menuItems) { //this means items were not found
            res.status(500).json("No items found");
            return;
        }

        if (rests.length == 0 && prefs.length == 0) { //no prefs or rests provided, so all items work
            res.status(200).json(menuItems);
            return;
        }

        //then find out the rests & prefs

        let matchingItems = [];

        menuItems.forEach((item) => { //for each item we check if it matches all preferences

            let allergens = item.allergens;
            let skipRests = false;
            let skipPrefs = false;

            //these if-checks below are testing edge cases
            if (allergens == null) {
                skipRests = true;
                skipPrefs = true;
            }
            if (allergens.length == 0 && (prefs.length != 0 || rests.length != 0)) {
                skipRests = true;
                skipPrefs = true;
            }

            allergens.forEach((allergen) => { //first check rests criteria
                if (!skipRests && rests.includes(allergen.Name) && allergen.Value == true) {
                    skipRests = true;
                }
            });

            if (!skipRests) { //if the item passes all the requested rests
                allergens.forEach((allergen) => { //then we check if it passes the requested prefs

                    if (!skipPrefs && prefs.includes(allergen.Name) && allergen.Value == false) {

                        skipPrefs = true;

                    }

                });
                if (!skipPrefs) matchingItems.push(item); //this item matches both prefs & rests
            }
        });
        res.status(200).json(matchingItems);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});

// this gets items from today matching the meal type from a dining court given the prefs and rests
router.post("/prefsAndRests/:mealType", async (req, res) => {
    var d = new Date();
    var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
    try {

        const rests = req.body.restrictions; //for example could be - "Coconut", "Peanuts"
        const prefs = req.body.preferences; //for example could be - "Vegan"
        const menuItems = await (MenuItem.find(
            {
                dateServed: today,
                courtData: {
                    $elemMatch: { $elemMatch: { $in: [req.params.mealType] } }
                }
            }
        ));

        if (!menuItems) { //this means items were not found
            res.status(500).json("No items found");
            return;
        }

        if (rests.length == 0 && prefs.length == 0) { //no prefs or rests provided, so all items work
            res.status(200).json(menuItems);
            return;
        }

        //then find out the rests & prefs

        let matchingItems = [];

        menuItems.forEach((item) => { //for each item we check if it matches all preferences

            let allergens = item.allergens;
            let skipRests = false;
            let skipPrefs = false;

            //these if-checks below are testing edge cases
            if (allergens == null) {
                skipRests = true;
                skipPrefs = true;
            }
            if (allergens.length == 0 && (prefs.length != 0 || rests.length != 0)) {
                skipRests = true;
                skipPrefs = true;
            }

            allergens.forEach((allergen) => { //first check rests criteria
                if (!skipRests && rests.includes(allergen.Name) && allergen.Value == true) {
                    skipRests = true;
                }
            });

            if (!skipRests) { //if the item passes all the requested rests
                allergens.forEach((allergen) => { //then we check if it passes the requested prefs

                    if (!skipPrefs && prefs.includes(allergen.Name) && allergen.Value == false) {

                        skipPrefs = true;

                    }

                });
                if (!skipPrefs) matchingItems.push(item); //this item matches both prefs & rests
            }
        });

        res.status(200).json(matchingItems);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});


/*
//this endpoint returns all items that align with the requested restrictions and preferences
//the request body must include the requested restrictions & preferences
//created the other functions in case both prefs & rests are not needed to be filtered
req url -> http://localhost:8000/api/menuInfo/prefsAndRests
Example req body below
{
    "preferences": ["Vegan"],
    "restrictions": ["Coconut", "Tree Nuts"]
}
^ that call + body will give all items that don't have Coconut or Tree Nuts in it and that are Vegan
*/
router.post("/prefsAndRests/:diningCourt", async (req, res) => {
    var d = new Date();
    var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());

    try {

        const rests = req.body.restrictions; //for example could be - "Coconut", "Peanuts"
        const prefs = req.body.preferences; //for example could be - "Vegan"

        // get all menu items
        const menuItems = await MenuItem.find({
            dateServed: today,
            courtData: {
                $elemMatch: {
                    $elemMatch: {
                        $in: [req.params.diningCourt]
                    }
                }
            }
        });

        if (!menuItems) { // this means items were not found
            res.status(500).json("No items found");
            return;
        }

        if (rests.length == 0 && prefs.length == 0) { // no prefs or rests provided, so all items work
            res.status(200).json(menuItems);
            return;
        }

        //then find out the rests & prefs

        let matchingItems = [];

        menuItems.forEach((item) => { //for each item we check if it matches all preferences

            let allergens = item.allergens;
            let skipRests = false;
            let skipPrefs = false;

            //these if-checks below are testing edge cases
            if (allergens == null) {
                skipRests = true;
                skipPrefs = true;
            }
            if (allergens.length == 0 && (prefs.length != 0 || rests.length != 0)) {
                skipRests = true;
                skipPrefs = true;
            }

            allergens.forEach((allergen) => { //first check rests criteria
                if (!skipRests && rests.includes(allergen.Name) && allergen.Value == true) {
                    skipRests = true;
                }
            });

            if (!skipRests) { //if the item passes all the requested rests
                allergens.forEach((allergen) => { //then we check if it passes the requested prefs

                    if (!skipPrefs && prefs.includes(allergen.Name) && allergen.Value == false) {

                        skipPrefs = true;

                    }
                });
                if (!skipPrefs) matchingItems.push(item); // this item matches both prefs & rests
            }
        });
        res.status(200).json(matchingItems);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});

/* Return top 25 menu items from today sorted by their average rating (rating must be greater than POPULAR_RATING_THRESHOLD) */
router.get("/popular", async (req, res) => {
    var d = new Date();
    var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
    try {
        const menuItems = await MenuItem.find({
            dateServed: today,
            avgRating: {
                $gte: POPULAR_RATING_THRESHOLD
            }
        }).sort({ avgRating: -1 }).limit(25);

        // TODO: create an variable to keep track on number of ratings for a given item, there should be a threshold of 2 ratings

        if (menuItems.length === 0) {
            console.log("No popular menu items found");
            res.status(500).json([]); /* send all menu items if no menu items found */
            return;
        } else {
            res.status(200).json(menuItems);
        }
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});

// this endpoint returns all menu items of the provided dining court
router.get("/all", async (req, res) => {
    var d = new Date();
    var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());

    try {
        const menuItems = await MenuItem.find({
            dateServed: today,
        });

        if (!menuItems) { //this means items were not found
            res.status(500).json("No items found");
            return;
        }
        res.status(200).json(menuItems);
    } catch (error) { console.log(error); }
});

// this endpoint returns all menu items of the provided dining court
router.get("/:diningCourt", async (req, res) => {
    var d = new Date();
    var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());

    try {
        const menuItems = await MenuItem.find({
            dateServed: today,
            courtData: {
                $elemMatch: { $elemMatch: { $in: [req.params.diningCourt] } }
            }
        });

        if (!menuItems) { //this means items were not found
            res.status(500).json("No items found");
            return;
        }
        res.status(200).json(menuItems);
    } catch (error) { console.log(error); }
});

// this endpoint returns all menu items of provided dining court that are serving during the meal specified
router.get("/meals/:diningCourt/:meal", async (req, res) => {
    //debug:
    var d = new Date();
    var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
    try {
        const menuItems = await (MenuItem.aggregate([
            {
                $unwind: "$courtData"
            }, {
                $match: {
                    $and: [{
                        courtData: {
                            $elemMatch: { $in: [req.params.diningCourt] }
                        }
                    },
                    {
                        courtData: {
                            $elemMatch: { $in: [req.params.meal] }
                        }
                    }, {
                        dateServed: today
                    }]
                }
            }, {
                $group: { /* deduplicate results */
                    _id: "$ID",
                    "ID": { $first: "$ID"},
                    "name": { $first: "$name"},
                    "courtData": { $first: "$courtData"},
                    "dateServed": { $first: "$dateServed"},
                    "isVegetarian": { $first: "$isVegetarian"},
                    "allergens": { $first: "$allergens"},
                    "nutritionFacts": { $first: "$nutritionFacts"},
                    "ingredients": { $first: "$ingredients"},
                    "avgRating": { $first: "$avgRating"},
                    "__v": { $first: "$__v"},
                }
            }
        ]));

        // console.log(menuItems);
        if (!menuItems) { //this means items were not found
            res.status(500).json("No items found");
            return;
        }

        console.log("Successfully retrieved " + req.params.diningCourt + "'s " + req.params.meal + " menu")
        res.status(200).json(menuItems);
    } catch (error) {
        console.log(error);
    }
});

// this endpoint returns the specified court's information
router.get("/courts/:diningCourt", async (req, res) => {
    try {
        const diningCourt = req.params.diningCourt;
        const court = await DiningCourt.findOne({
            name: diningCourt
        });
        if (court == null) {
            res.status(500).json("No court found");
            return;
        }
        res.status(200).json(court);
        return;
    } catch (error) {
        res.status(500).json("Error: " + error);
        console.log("Error: " + error);
    }
})

// this endpoint returns all menu items of the provided dining court that aligns 
// with a user's dietary preferences and restrictions
router.get("/prefs/:diningCourt/:username", async (req, res) => {
    var d = new Date();
    var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
    // console.log("today is " + d);
    try {
        const user = await User.findOne({
            username: req.params.username
        });
        if (!user) {
            res.status(500).json("User doesn't exist");
            return;
        }

        // get preferences from response
        const preferences = user.preferences;

        // get restrictions from response
        const restrictions = user.restrictions;

        /* query menu items */
        const menuItems = await MenuItem.find({
            dateServed: today,
            courtData: {
                $elemMatch: {
                    $elemMatch: {
                        $in: [req.params.diningCourt]
                    }
                }
            }
        });

        if (!menuItems || menuItems.length == 0) { // this means items were not found
            res.status(200).json([]); // empty
            return;
        }
        let courtsItems = [];
        menuItems.forEach((item) => {
            let courtsArray = item.courtData;

            if (courtsArray == null) return;

            allergens = item.allergens;
            let matchesPrefs = true;

            /* if doesn't match all restrictions then continue */
            if (restrictions.length > 0) {
                if (allergens.length === 0) { /* edge case for when item has no allergen info */
                    matchesPrefs = false;
                }
                for (const allergen of allergens) {
                    if (restrictions.includes(allergen.Name) && allergen.Value === true) {
                        matchesPrefs = false;
                        break;
                    }
                }
            }

            /* if doesn't match all preferences then continue */
            if (preferences.length > 0) {
                if (allergens.length === 0) { /* edge case for when item has no allergen info */
                    matchesPrefs = false;
                }
                for (const allergen of allergens) {
                    if (preferences.includes(allergen.Name) && allergen.Value === false) {
                        matchesPrefs = false;
                        break;
                    }
                }
            }
            if (matchesPrefs) {
                courtsItems.push(item);
            }
        });
        res.status(200).json(courtsItems);
    } catch (error) {
        console.log(error);
    }
});

/*
Returns a menu item based on the provided item ID
Example Call: http://localhost:8000/api/menuInfo/item/76f9d158-d45d-42e0-8e37-8bd3c2c45986
Returns this object: 
{
    ...
    "ID": "76f9d158-d45d-42e0-8e37-8bd3c2c45986",
    "name": "Scrambled Eggs With Bacon And Cheese"
    ...
}
*/
router.get("/item/:menuItemID", async (req, res) => {
    try {
        const menuItemID = req.params.menuItemID;

        const item = await MenuItem.findOne({
            ID: menuItemID
        });

        if (item == null) {
            res.status(500).json("No item found");
            return;
        }
        res.status(200).json(item);
        return;
    } catch (error) {
        res.status(500).json("Error: " + error);
        console.log("Error: " + error);
    }
});

router.get("/busy/:diningCourt", async (req, res) => {
    //debug:
    var d = new Date();
    try {
        const court = req.params.diningCourt;
        var busytime = "not busy";
        if (court === "Wiley") {
            // console.log("wiley")
            if (d.getHours() > 20) {
                busytime = "not too busy"
            } else if (d.getHours() > 18) {
                busytime = "as busy as it gets"
            } else if (d.getHours() > 16) {
                busytime = "a little busy"
            } else if (d.getHours() > 14) {
                busytime = "not busy"
            } else if (d.getHours() > 12) {
                busytime = "as busy as it gets";
            } else if (d.getHours() > 10) {
                busytime = "not busy";
            } else if (d.getHours() > 8) {
                busytime = "not too busy";
            } else if (d.getHours() > 6) {
                busytime = "not busy";
            }
        }
        else if (court === "Windsor") {
            // console.log("windsor")
            if (d.getHours() > 20) {
                busytime = "closed"
            } else if (d.getHours() > 18) {
                busytime = "not too busy"
            } else if (d.getHours() > 16) {
                busytime = "a little busy"
            } else if (d.getHours() > 14) {
                busytime = "not too busy"
            } else if (d.getHours() > 12) {
                busytime = "as busy as it gets";
            } else if (d.getHours() > 10) {
                busytime = "not too busy";
            } else if (d.getHours() > 8) {
                busytime = "not busy";
            } else if (d.getHours() > 6) {
                busytime = "closed";
            }
        }
        else if (court === "Hillenbrand") {
            // console.log("hilly")
            if (d.getHours() > 20) {
                busytime = "closed"
            } else if (d.getHours() > 18) {
                busytime = "a little busy"
            } else if (d.getHours() > 16) {
                busytime = "a little busy"
            } else if (d.getHours() > 14) {
                busytime = "not too busy"
            } else if (d.getHours() > 12) {
                busytime = "as busy as it gets";
            } else if (d.getHours() > 10) {
                busytime = "closed";
            } else if (d.getHours() > 8) {
                busytime = "not too busy";
            } else if (d.getHours() > 6) {
                busytime = "not busy";
            }
        }
        else if (court === "Ford") {
            // console.log("ford")
            if (d.getHours() > 20) {
                busytime = "closed"
            } else if (d.getHours() > 18) {
                busytime = "a little busy"
            } else if (d.getHours() > 16) {
                busytime = "a little busy"
            } else if (d.getHours() > 14) {
                busytime = "not too busy"
            } else if (d.getHours() > 12) {
                busytime = "as busy as it gets";
            } else if (d.getHours() > 10) {
                busytime = "closed";
            } else if (d.getHours() > 8) {
                busytime = "not too busy";
            } else if (d.getHours() > 6) {
                busytime = "not busy";
            }
        }
        else if (court === "Earhart") {
            // console.log("earhart")
            if (d.getHours() > 20) {
                busytime = "not busy"
            } else if (d.getHours() > 18) {
                busytime = "a little busy"
            } else if (d.getHours() > 16) {
                busytime = "not too busy"
            } else if (d.getHours() > 14) {
                busytime = "closed"
            } else if (d.getHours() > 12) {
                busytime = "a little busy";
            } else if (d.getHours() > 10) {
                busytime = "not busy";
            } else if (d.getHours() > 8) {
                busytime = "not too busy";
            } else if (d.getHours() > 6) {
                busytime = "not busy";
            }
        }
        // console.log("Successfully retrieved " + req.params.diningCourt + "'s busy time at " + d)
        // console.log("busy time is: " + busytime);
        res.status(200).json(busytime);
        return;
    } catch (error) {
        console.log(error);
    }
});

/* gets items matching custom prefs and rests of a particular meal type from a dining court*/
router.post("/prefsAndRests/:diningCourt/:mealType", async (req, res) => {
    var d = new Date();
    var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());

    try {

        const rests = req.body.restrictions; //for example could be - "Coconut", "Peanuts"
        const prefs = req.body.preferences; //for example could be - "Vegan"

        // get all menu items
        const menuItems = await (MenuItem.aggregate([
            {
                $unwind: "$courtData"
            }, {
                $match: {
                    $and: [{
                        courtData: {
                            $elemMatch: { $in: [req.params.diningCourt] }
                        }
                    },
                    {
                        courtData: {
                            $elemMatch: { $in: [req.params.mealType] }
                        }
                    }, {
                        dateServed: today
                    }]
                }
            }, {
                $group: { /* deduplicate results */
                    _id: "$ID",
                    "ID": { $first: "$ID"},
                    "name": { $first: "$name"},
                    "courtData": { $first: "$courtData"},
                    "dateServed": { $first: "$dateServed"},
                    "isVegetarian": { $first: "$isVegetarian"},
                    "allergens": { $first: "$allergens"},
                    "nutritionFacts": { $first: "$nutritionFacts"},
                    "ingredients": { $first: "$ingredients"},
                    "avgRating": { $first: "$avgRating"},
                    "__v": { $first: "$__v"},
                }
            }
        ]));

        if (!menuItems) { // this means items were not found
            res.status(500).json("No items found");
            return;
        }

        if (rests.length == 0 && prefs.length == 0) { // no prefs or rests provided, so all items work
            res.status(200).json(menuItems);
            return;
        }

        //then find out the rests & prefs

        let matchingItems = [];

        menuItems.forEach((item) => { //for each item we check if it matches all preferences

            let allergens = item.allergens;
            let skipRests = false;
            let skipPrefs = false;

            //these if-checks below are testing edge cases
            if (allergens == null) {
                skipRests = true;
                skipPrefs = true;
            }
            if (allergens.length == 0 && (prefs.length != 0 || rests.length != 0)) {
                skipRests = true;
                skipPrefs = true;
            }

            allergens.forEach((allergen) => { //first check rests criteria
                if (!skipRests && rests.includes(allergen.Name) && allergen.Value == true) {
                    skipRests = true;
                }
            });

            if (!skipRests) { //if the item passes all the requested rests
                allergens.forEach((allergen) => { //then we check if it passes the requested prefs

                    if (!skipPrefs && prefs.includes(allergen.Name) && allergen.Value == false) {

                        skipPrefs = true;

                    }
                });
                if (!skipPrefs) matchingItems.push(item); // this item matches both prefs & rests
            }
        });
        res.status(200).json(matchingItems);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});

// this endpoint returns all menu items of the provided dining court that aligns 
// with a user's dietary preferences and restrictions of a specific meal time
router.get("/prefs/:diningCourt/:username/:mealType", async (req, res) => {
    var d = new Date();
    var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
    // console.log("today is " + d);
    try {
        const user = await User.findOne({
            username: req.params.username
        });
        if (!user) {
            res.status(500).json("User doesn't exist");
            return;
        }

        // get preferences from response
        const preferences = user.preferences;
      
        // get restrictions from response
        const restrictions = user.restrictions;

        /* query menu items */
        const menuItems = await (MenuItem.aggregate([
            {
                $unwind: "$courtData"
            }, {
                $match: {
                    $and: [{
                        courtData: {
                            $elemMatch: { $in: [req.params.diningCourt] }
                        }
                    },
                    {
                        courtData: {
                            $elemMatch: { $in: [req.params.mealType] }
                        }
                    }, {
                        dateServed: today
                    }]
                }
            }, {
                $group: { /* deduplicate results */
                    _id: "$ID",
                    "ID": { $first: "$ID"},
                    "name": { $first: "$name"},
                    "courtData": { $first: "$courtData"},
                    "dateServed": { $first: "$dateServed"},
                    "isVegetarian": { $first: "$isVegetarian"},
                    "allergens": { $first: "$allergens"},
                    "nutritionFacts": { $first: "$nutritionFacts"},
                    "ingredients": { $first: "$ingredients"},
                    "avgRating": { $first: "$avgRating"},
                    "__v": { $first: "$__v"},
                }
            }
        ]));

        if (!menuItems || menuItems.length == 0) { // this means items were not found
            res.status(200).json([]); // empty
            return;
        }
        let courtsItems = [];
        menuItems.forEach((item) => {
            let courtsArray = item.courtData;

            if (courtsArray == null) return;

            allergens = item.allergens;
            let matchesPrefs = true;

            /* if doesn't match all restrictions then continue */
            if (restrictions.length > 0) {
                if (allergens.length === 0) { /* edge case for when item has no allergen info */
                    matchesPrefs = false;
                }
                for (const allergen of allergens) {
                    if (restrictions.includes(allergen.Name) && allergen.Value === true) {
                        matchesPrefs = false;
                        break;
                    }
                }
            }

            /* if doesn't match all preferences then continue */
            if (preferences.length > 0) {
                if (allergens.length === 0) { /* edge case for when item has no allergen info */
                    matchesPrefs = false;
                }
                for (const allergen of allergens) {
                    if (preferences.includes(allergen.Name) && allergen.Value === false) {
                        matchesPrefs = false;
                        break;
                    }
                }
            }
            if (matchesPrefs) {
                courtsItems.push(item);
            }
        });
        res.status(200).json(courtsItems);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
