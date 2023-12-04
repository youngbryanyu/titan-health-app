const router = require("express").Router();
const Saved = require("../models/saved");
const MenuItem = require("../models/menuItem");

// TODO: add verify to all calls, add auth token to calls on frontend

// get all recommended items based on user's saved items
router.get("/saved/:userId", async (req, res) => {
    // console.log("get all items")
    try {
        var d = new Date();
        var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());

        //find all the user's saved items
        const savedItems = await Saved.find({ userId: req.params.userId });

        if (!savedItems || savedItems.length == 0) { //this means no saved items were found
            // we will return all menu items, with a boolean to indicate that the mesage
            // "save more items to have better recommendations"

            const todaysItems = await MenuItem.find({
                dateServed: today,
            });

            const toReturn = {
                items: todaysItems,
                message: "Save more items to have more personalized recommendations!"
            }

            res.status(200).json(toReturn);
            return;

        }

        // preferences
        const VEGAN = "Vegan";
        const VEGETARIAN = "Vegetarian";
        // restrictions
        const COCONUT = "Coconut";
        const EGGS = "Eggs";
        const FISH = "Fish";
        const GLUTEN = "Gluten";
        const SESAME = "Sesame";
        const SHELLFISH = "Shellfish";
        const SOY = "Soy";
        const TREE_NUTS = "Tree Nuts";
        const WHEAT = "Wheat";
        const MILK = "Milk";
        const PEANUTS = "Peanuts";

        let vegetarianWeight = 0;
        let veganWeight = 0;
        let coconutWeight = 0;
        let eggsWeight = 0;
        let fishWeight = 0;
        let glutenWeight = 0;
        let sesameWeight = 0;
        let shellfishWeight = 0;
        let soyWeight = 0;
        let treeNutsWeight = 0;
        let wheatWeight = 0;
        let milkWeight = 0;
        let peanutsWeight = 0;

        //this is be a 13-element array with each spot representage weightage of different attributes

        let index = 0;

        savedItems.forEach(async (item) => {
            const menuItem = await MenuItem.findOne({ ID: item.menuItemID }); //the itemObj of this saved item

            var itemsAllergens;
            itemsAllergens = menuItem.allergens;

            // now go through its allergens and add true attributes to respective elements in array
            if (!itemsAllergens || itemsAllergens.length)
                itemsAllergens.forEach((allergen) => {

                    if (allergen.Value == true) {
                        //check which allergen it is then update weight

                        switch (allergen.Name) { //this switch updates weights array using the given allergen
                            case VEGETARIAN:
                                vegetarianWeight += 1;
                                break;
                            case VEGAN:
                                veganWeight += 1;
                                break;
                            case COCONUT:
                                coconutWeight += 1;
                                break;
                            case EGGS:
                                eggsWeight += 1;
                                break;
                            case FISH:
                                fishWeight += 1;
                                break;
                            case GLUTEN:
                                glutenWeight += 1;
                                break;
                            case SESAME:
                                sesameWeight += 1;
                                break;
                            case SHELLFISH:
                                shellfishWeight += 1;
                                break;
                            case SOY:
                                soyWeight += 1;
                                break;
                            case TREE_NUTS:
                                treeNutsWeight += 1;
                                break;
                            case WHEAT:
                                wheatWeight += 1;
                                break;
                            case MILK:
                                milkWeight += 1;
                                break;
                            case PEANUTS:
                                peanutsWeight += 1;
                                break;
                        }

                    }

                }); // after this loop, the allergens of this item have been dealt with

            if (index == savedItems.length - 1) { // if we are on the last element in the array

                let weights = [vegetarianWeight, veganWeight, coconutWeight, eggsWeight, fishWeight, glutenWeight,
                    sesameWeight, shellfishWeight, soyWeight, treeNutsWeight, wheatWeight, milkWeight, peanutsWeight];

                // now we just need select the attributes that have a weight above 3
                // and if no weights above 3, return all items

                let finalPrefs = [];
                let finalRests = [];

                for (let j = 0; j < weights.length; j++) {

                    if (weights[j] >= 3) {

                        switch (j) { //this switch adds the attribute to the final arrays
                            case 0:
                                finalPrefs.push(VEGETARIAN);
                                break;
                            case 1:
                                finalPrefs.push(VEGAN);
                                break;
                            case 2:
                                finalRests.push(COCONUT);
                                break;
                            case 3:
                                finalRests.push(EGGS);
                                break;
                            case 4:
                                finalRests.push(FISH);
                                break;
                            case 5:
                                finalRests.push(GLUTEN);
                                break;
                            case 6:
                                finalRests.push(SESAME);
                                break;
                            case 7:
                                finalRests.push(SHELLFISH);
                                break;
                            case 8:
                                finalRests.push(SOY);
                                break;
                            case 9:
                                finalRests.push(TREE_NUTS);
                                break;
                            case 10:
                                finalRests.push(WHEAT);
                                break;
                            case 11:
                                finalRests.push(MILK);
                                break;
                            case 12:
                                finalRests.push(PEANUTS);
                                break;
                        }

                    }

                } //after this loop the final attributes have been found
                if (finalPrefs.length == 0 && finalRests.length == 0) { //this means no attributes were >= 3 weight

                    //we will return all menu items, with a boolean to indicate that the mesage
                    //"save more items to have better recommendations"

                    const todaysItems = await MenuItem.find({
                        dateServed: today,
                    });

                    const toReturn = {
                        items: todaysItems,
                        message: "Save more items to have more personalized recommendations!"
                    }

                    res.status(200).json(toReturn);
                    return;

                }

                //now we can return the arrays of preferences and restrictions

                const toReturn = {
                    preferences: finalPrefs,
                    restrictions: finalRests,
                    message: "All Good!"
                };

                // console.log("recommendation weights: " + weights);

                res.status(200).json(toReturn);
                return;

            }

            index += 1;

        }); //after this loop all items' attributes have been added to weightages


    } catch (error) {

        res.status(500).json("Error: " + error);

    }

});

// get all recommended items based on user's saved items that match the mealtype
router.get("/saved/:userId/:mealType", async (req, res) => {
    // console.log("get items matching meal type")
    try {
        var d = new Date();
        var today = new Date(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());

        //find all the user's saved items
        const savedItems = await Saved.find({ userId: req.params.userId });

        if (!savedItems || savedItems.length == 0) { //this means no saved items were found

            // we will return all menu items, with a boolean to indicate that the mesage
            // "save more items to have better recommendations"
            const todaysItems = await (MenuItem.find(
                {
                    dateServed: today,
                    courtData: {
                        $elemMatch: { $elemMatch: { $in: [req.params.mealType] } }
                    }
                }
            ));

            const toReturn = {
                items: todaysItems,
                message: "Save more items to have more personalized recommendations!"
            }

            res.status(200).json(toReturn);
            return;

        }

        // preferences
        const VEGAN = "Vegan";
        const VEGETARIAN = "Vegetarian";
        // restrictions
        const COCONUT = "Coconut";
        const EGGS = "Eggs";
        const FISH = "Fish";
        const GLUTEN = "Gluten";
        const SESAME = "Sesame";
        const SHELLFISH = "Shellfish";
        const SOY = "Soy";
        const TREE_NUTS = "Tree Nuts";
        const WHEAT = "Wheat";
        const MILK = "Milk";
        const PEANUTS = "Peanuts";

        let vegetarianWeight = 0;
        let veganWeight = 0;
        let coconutWeight = 0;
        let eggsWeight = 0;
        let fishWeight = 0;
        let glutenWeight = 0;
        let sesameWeight = 0;
        let shellfishWeight = 0;
        let soyWeight = 0;
        let treeNutsWeight = 0;
        let wheatWeight = 0;
        let milkWeight = 0;
        let peanutsWeight = 0;

        //this is be a 13-element array with each spot representage weightage of different attributes

        let index = 0;

        savedItems.forEach(async (item) => {

            const menuItem = await MenuItem.findOne({ ID: item.menuItemID }); //the itemObj of this saved item
            const itemsAllergens = menuItem.allergens;
            // now go through its allergens and add true attributes to respective elements in array
            if (!itemsAllergens || itemsAllergens.length)
                itemsAllergens.forEach((allergen) => {

                    if (allergen.Value == true) {
                        //check which allergen it is then update weight

                        switch (allergen.Name) { //this switch updates weights array using the given allergen
                            case VEGETARIAN:
                                vegetarianWeight += 1;
                                break;
                            case VEGAN:
                                veganWeight += 1;
                                break;
                            case COCONUT:
                                coconutWeight += 1;
                                break;
                            case EGGS:
                                eggsWeight += 1;
                                break;
                            case FISH:
                                fishWeight += 1;
                                break;
                            case GLUTEN:
                                glutenWeight += 1;
                                break;
                            case SESAME:
                                sesameWeight += 1;
                                break;
                            case SHELLFISH:
                                shellfishWeight += 1;
                                break;
                            case SOY:
                                soyWeight += 1;
                                break;
                            case TREE_NUTS:
                                treeNutsWeight += 1;
                                break;
                            case WHEAT:
                                wheatWeight += 1;
                                break;
                            case MILK:
                                milkWeight += 1;
                                break;
                            case PEANUTS:
                                peanutsWeight += 1;
                                break;
                        }

                    }

                }); // after this loop, the allergens of this item have been dealt with

            if (index == savedItems.length - 1) { // if we are on the last element in the array

                let weights = [vegetarianWeight, veganWeight, coconutWeight, eggsWeight, fishWeight, glutenWeight,
                    sesameWeight, shellfishWeight, soyWeight, treeNutsWeight, wheatWeight, milkWeight, peanutsWeight];

                // now we just need select the attributes that have a weight above 3
                // and if no weights above 3, return all items

                let finalPrefs = [];
                let finalRests = [];

                for (let j = 0; j < weights.length; j++) {

                    if (weights[j] >= 3) {

                        switch (j) { //this switch adds the attribute to the final arrays
                            case 0:
                                finalPrefs.push(VEGETARIAN);
                                break;
                            case 1:
                                finalPrefs.push(VEGAN);
                                break;
                            case 2:
                                finalRests.push(COCONUT);
                                break;
                            case 3:
                                finalRests.push(EGGS);
                                break;
                            case 4:
                                finalRests.push(FISH);
                                break;
                            case 5:
                                finalRests.push(GLUTEN);
                                break;
                            case 6:
                                finalRests.push(SESAME);
                                break;
                            case 7:
                                finalRests.push(SHELLFISH);
                                break;
                            case 8:
                                finalRests.push(SOY);
                                break;
                            case 9:
                                finalRests.push(TREE_NUTS);
                                break;
                            case 10:
                                finalRests.push(WHEAT);
                                break;
                            case 11:
                                finalRests.push(MILK);
                                break;
                            case 12:
                                finalRests.push(PEANUTS);
                                break;
                        }

                    }

                } //after this loop the final attributes have been found

                if (finalPrefs.length == 0 && finalRests.length == 0) { //this means no attributes were >= 3 weight

                    //we will return all menu items, with a boolean to indicate that the mesage
                    //"save more items to have better recommendations"

                    const todaysItems = await (MenuItem.find(
                        {
                            dateServed: today,
                            courtData: {
                                $elemMatch: { $elemMatch: { $in: [req.params.mealType] } }
                            }
                        }
                    ));

                    const toReturn = {
                        items: todaysItems,
                        message: "Save more items to have more personalized recommendations!"
                    }

                    res.status(200).json(toReturn);
                    return;

                }

                //now we can return the arrays of preferences and restrictions

                const toReturn = {
                    preferences: finalPrefs,
                    restrictions: finalRests,
                    message: "All Good!"
                };

                // console.log("recommendation weights: " + weights);

                res.status(200).json(toReturn);
                return;

            }

            index += 1;

        }); //after this loop all items' attributes have been added to weightages


    } catch (error) {

        res.status(500).json("Error: " + error);

    }

});

module.exports = router;