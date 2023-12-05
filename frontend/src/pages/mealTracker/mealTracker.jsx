/* React page for the meal tracker */
import { Box, List, ListItem, Paper, InputLabel, MenuItem, FormControl, Select, Divider } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { makeStyles } from "@mui/styles";
import Navbar from "../../components/navbar/navbar";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../utils/authentication/auth-context";
import { useState, useEffect, useContext } from 'react';
import "./mealTracker.scss";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import ROUTES from "../../routes";
import { PieChart } from "@mui/x-charts/PieChart";

/* Styles for page */
const useStyles = makeStyles((theme) => ({
    root: {
        color: "black",
    },
    selected: {
        color: "white"
    }
}));

/**
 * Returns a react component consisting of the meal tracker page. Includes all logic relevant to tracking meals.
 * 
 * @returns a react component consisting of the meal tracker page.
 */
const MealTracker = () => {
    // /* force rerender on location change */
    const location = useLocation();
    useEffect(() => {
        if (location.state?.refresh) {
            getFoodItems();
        }
        // eslint-disable-next-line
    }, [location]);

    /* scrolling list height for each meal type list */
    const MEAL_LIST_HEIGHT = 105;

    /* Style object */
    const classes = useStyles();

    /* User's food items currently displayed in list */
    const [foodItems, setFoodItems] = useState([]);

    /* User from auth context */
    const { user } = useContext(AuthContext);
    const userId = user._id;

    /* Food info corresponding to input boxes */
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbohydrates, setCarbs] = useState('');
    const [servings, setServings] = useState('');
    const [servingSize, setServingSize] = useState('');

    /* Daily totals */
    const [totalCaloriesToday, setTotalCaloriesToday] = useState('');
    const [totalProteinToday, setTotalProteinToday] = useState('');
    const [totalCarbsToday, setTotalCarbsToday] = useState('');
    const [totalFatToday, setTotalFatToday] = useState('');

    /* meal specific totals */
    const [totalBreakfastCalories, setTotalBreakfastCalories] = useState('');
    const [totalLunchCalories, setTotalLunchCalories] = useState('');
    const [totalDinnerCalories, setTotalDinnerCalories] = useState('');
    const [totalSnackCalories, setTotalSnackCalories] = useState('');

    /* Meal types */
    const EMPTY = 'Choose meal type';
    const BREAKFAST = 'Breakfast';
    const LUNCH = 'Lunch';
    const DINNER = 'Dinner';
    const SNACK = 'Snack';
    const [mealType, setMealType] = useState(EMPTY);

    /* Mapping of different error messages. */
    const ERROR_MESSAGES = {
        INCOMPLETE_FIELDS_ERROR: 'Please enter all necessary fields before saving',
        INVALID_CALORIES_ERROR: "Calories must be a number",
        INVALID_PROTEIN_ERROR: "Protein must be a number",
        INVALID_CARBS_ERROR: "Carbohydrates must be a number",
        INVALID_FAT_ERROR: "Fat must be a number",
        INVALID_SERVINGS_ERROR: "Servings must be a number",
    }

    const [errorMessage, setErrorMessage] = useState(ERROR_MESSAGES.INCOMPLETE_FIELDS_ERROR);
    const [allFieldsComplete, setAllFieldsComplete] = useState(true); /* initialize to true to hide error message */

    /* Macro low-level nutrition goals */
    const [calorieGoal, setCalorieGoal] = useState('');
    const [proteinGoal, setProteinGoal] = useState('');
    const [carbohydrateGoal, setCarbohydrateGoal] = useState('');
    const [fatGoal, setFatGoal] = useState('');

    /* Get low level nutrition macro goals */
    const getNutritionGoals = () => {
        axios.get('users/nutrition/' + user._id, {
            headers: {
                token: "Bearer " + user.accessToken
            }


        }).then(res => {
            setCalorieGoal(res.data.calories);
            setCarbohydrateGoal(res.data.carbohydrates);
            setFatGoal(res.data.fat);
            setProteinGoal(res.data.protein);

            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })


    };

    /* Load food items on page render */
    useEffect(() => {
        getFoodItems(); /* note: removed only run on first render code */
        getNutritionGoals();
        // eslint-disable-next-line
    }, []);

    // Gets food items. should be called on page load
    const getFoodItems = async () => {
        try {
            const response = await axios.get(`users/allFoods/${userId}`, {
                headers: { token: `Bearer ${user.accessToken}` }
            });
            setFoodItems(response.data);

            /* calculate total calories */
            let totalCalories = 0;
            let totalBreakfast = 0;
            let totalLunch = 0;
            let totalDinner = 0;
            let totalSnack = 0;
            response.data.forEach(item => {
                totalCalories += item.calories * item.servings;

                if (item.mealType === BREAKFAST && isValidNumber(item.calories)) {
                    totalBreakfast += item.calories * item.servings;
                }
                if (item.mealType === LUNCH && isValidNumber(item.calories)) {
                    totalLunch += item.calories * item.servings;
                }
                if (item.mealType === DINNER && isValidNumber(item.calories)) {
                    totalDinner += item.calories * item.servings;
                }
                if (item.mealType === SNACK && isValidNumber(item.calories)) {
                    totalSnack += item.calories * item.servings;
                }
            });
            setTotalCaloriesToday(totalCalories);
            setTotalBreakfastCalories(totalBreakfast);
            setTotalLunchCalories(totalLunch);
            setTotalDinnerCalories(totalDinner);
            setTotalSnackCalories(totalSnack);

            /* calculate total protein */
            let totalProtein = 0;
            response.data.forEach(item => totalProtein += (isValidNumber(item.protein)) ? item.protein * item.servings : 0);
            setTotalProteinToday(totalProtein);

            /* calculate total carbohydrates */
            let totalCarbs = 0;
            response.data.forEach(item => totalCarbs += (isValidNumber(item.carbohydrates)) ? item.carbohydrates * item.servings : 0);
            setTotalCarbsToday(totalCarbs);

            /* calculate total fats */
            let totalFat = 0;
            response.data.forEach(item => totalFat += (isValidNumber(item.fat)) ? item.fat * item.servings : 0);
            setTotalFatToday(totalFat);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Checks if a value is a number and is greater than 0
     * 
     * @param {*} str arbitrary input value
     * @returns true if the value is valid according to the requirements
     */
    function isValidNumber(str) {
        const num = parseFloat(str);
        return !isNaN(num) && num >= 0 && str.trim() === num.toString();
    }

    const handleAddFood = async () => {
        /* initialize to true to hide error message */
        setAllFieldsComplete(true);

        /* check if all fields were entered */
        if (foodName === '' || calories === '' || protein === '' || carbohydrates === '' || servings === '' || servingSize === '' || mealType === EMPTY) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INCOMPLETE_FIELDS_ERROR);
            return;
        }

        /* check if unit fields are numbers and >= 0 */
        if (!isValidNumber(calories)) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_CALORIES_ERROR);
            return;
        }
        if (!isValidNumber(protein)) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_PROTEIN_ERROR);
            return;
        }
        if (!isValidNumber(carbohydrates)) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_CARBS_ERROR);
            return;
        }
        if (!isValidNumber(fat)) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_FAT_ERROR);
            return;
        }
        if (!isValidNumber(servings)) {
            setAllFieldsComplete(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_SERVINGS_ERROR);
            return;
        }

        try {
            const res = await axios.put(
                `users/addFood/${userId}`,
                { foodName, calories, fat, protein, carbohydrates, servings, servingSize, mealType },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );

            // Refresh the food items totals and the list after editing
            setFoodItems(res.data.foods);
            setTotalCaloriesToday(totalCaloriesToday + calories * servings);
            setTotalProteinToday(totalProteinToday + protein * servings);
            setTotalCarbsToday(totalCarbsToday + carbohydrates * servings);
            setTotalFatToday(totalFatToday + fat * servings);

            // refresh meal specific
            if (mealType === BREAKFAST) {
                setTotalBreakfastCalories(totalBreakfastCalories + calories * servings);
            }
            if (mealType === LUNCH) {
                setTotalLunchCalories(totalLunchCalories + calories * servings);
            }
            if (mealType === DINNER) {
                setTotalDinnerCalories(totalDinnerCalories + calories * servings);
            }
            if (mealType === SNACK) {
                setTotalSnackCalories(totalSnackCalories + calories * servings);
            }

            // Clear the editedNutritionFacts state
            setFoodName('');
            setCalories('');
            setProtein('');
            setFat('');
            setCarbs('');
            setServings('');
            setServingSize('');
            setMealType(EMPTY);
        } catch (error) {
            console.error(error);
        }
    };

    /* Handles when user selects meal type */
    const handleMealTypeChange = (event) => {
        setMealType(event.target.value);
    }

    /* A list item in display */
    function buildListItem(item, mealType) {
        if (item.mealType !== mealType) {
            return <></>
        }

        let name = item.foodName;
        if (name.length > 30) {
            name = name.substring(0, 30) + "...";
        }
        const id = item.hash;
        const servings = item.servings;
        const servingSize = item.servingSize;
        const calories = item.calories
        const totalCalories = calories * servings;

        return (
            <div key={id}>
                <Link to={ROUTES.FOOD_ITEM_INFO.replace(":foodItemHash", id)} className="link">
                    <ListItem component="div" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 1, paddingRight: 1, paddingTop: .5, paddingBottom: .5 }}>
                        <div>
                            <span>{name}</span>
                            <div className="servingLabel">
                                {`${servings} servings (${servingSize})`}
                            </div>
                        </div>
                        <span>{totalCalories}</span>
                    </ListItem>
                </Link>
                <Divider />
            </div>
        );
    }

    return (
        <div className="mealTracker">
            <Navbar />
            <Stack className="stack" spacing={2} ml={"50px"} alignItems={"center"} justifyContent={"center"}>
                <div>
                    {/* breakfast */}
                    <h4 className="sectionTitle">
                        <span>Breakfast</span>
                        <div>
                            <span className="calorieLabelValue">{totalBreakfastCalories}</span>
                            <div className="calorieLabel">calories</div>
                        </div>
                    </h4>
                    <Box sx={{ width: 360, height: MEAL_LIST_HEIGHT, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                        <Paper style={{ height: MEAL_LIST_HEIGHT, overflow: 'auto' }}>
                            <List>
                                {
                                    foodItems.map((item) => buildListItem(item, BREAKFAST))
                                }
                            </List>
                        </Paper>
                    </Box>

                    {/* lunch */}
                    <h4 className="sectionTitle">
                        <span>Lunch</span>
                        <div>
                            <span className="calorieLabelValue">{totalLunchCalories}</span>
                            <div className="calorieLabel">calories</div>
                        </div>
                    </h4>
                    <Box sx={{ width: 360, height: MEAL_LIST_HEIGHT, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                        <Paper style={{ height: MEAL_LIST_HEIGHT, overflow: 'auto' }}>
                            <List>
                                {
                                    foodItems.map((item) => buildListItem(item, LUNCH))
                                }
                            </List>
                        </Paper>
                    </Box>

                    {/* dinner */}
                    <h4 className="sectionTitle">
                        <span>Dinner</span>
                        <div>
                            <span className="calorieLabelValue">{totalDinnerCalories}</span>
                            <div className="calorieLabel">calories</div>
                        </div>
                    </h4>
                    <Box sx={{ width: 360, height: MEAL_LIST_HEIGHT, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                        <Paper style={{ height: MEAL_LIST_HEIGHT, overflow: 'auto' }}>
                            <List>
                                {
                                    foodItems.map((item) => buildListItem(item, DINNER))
                                }
                            </List>
                        </Paper>
                    </Box>

                    {/* snack */}
                    <h4 className="sectionTitle">
                        <span>Snack</span>
                        <div>
                            <span className="calorieLabelValue">{totalSnackCalories}</span>
                            <div className="calorieLabel">calories</div>
                        </div>
                    </h4>
                    <Box sx={{ width: 360, height: MEAL_LIST_HEIGHT, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                        <Paper style={{ height: MEAL_LIST_HEIGHT, overflow: 'auto' }}>
                            <List>
                                {
                                    foodItems.map((item) => buildListItem(item, SNACK))
                                }
                            </List>
                        </Paper>
                    </Box>
                </div>
            </Stack>

            <Stack className="stack middle" spacing={2} alignItems={"center"} justifyContent={"center"}>
                <div>
                    <h4 className="sectionTitle">
                        <span>Total Daily Macronutrients</span>
                        <Tooltip className="toolTip" title={"Edit your daily macro goals by going to *Nutrition*, then to *Nutrition Goals* in the navigation bar at the top of the page"} placement="bottom">
                            <IconButton color="inherit">
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                        <div>
                            <span className="goalLabelTop">
                                {"Goals"}
                            </span>
                            <div className="goalLabelBottom">for today</div>

                        </div>
                    </h4>
                    <ListItem className="listContainer" component="div" disablePadding style={{ display: 'flex', justifyContent: 'space-between', width: 350 }}>
                        <span>Calories</span>
                        <span className="listItem">{totalCaloriesToday}</span>
                        <span className="goalItem">
                            <span className="goalSpace">/</span>
                            <span className="goalValue">{`${calorieGoal}`}</span>
                        </span>
                    </ListItem>
                    <ListItem className="listContainer" component="div" disablePadding style={{ display: 'flex', justifyContent: 'space-between', width: 350 }}>
                        <span>Protein</span>
                        <span className="listItem">{totalProteinToday}</span>
                        <span className="goalItem">
                            <span className="goalSpace">/</span>
                            <span className="goalValue">{`${proteinGoal}`}</span>
                        </span>
                    </ListItem>
                    <ListItem className="listContainer" component="div" disablePadding style={{ display: 'flex', justifyContent: 'space-between', width: 350 }}>
                        <span>Carbohydrates</span>
                        <span className="listItem">{totalCarbsToday}</span>
                        <span className="goalItem">
                            <span className="goalSpace">/</span>
                            <span className="goalValue">{`${carbohydrateGoal}`}</span>
                        </span>
                    </ListItem>
                    <ListItem className="listContainer" component="div" disablePadding style={{ display: 'flex', justifyContent: 'space-between', width: 350 }}>
                        <span>Fat</span>
                        <span className="listItem">{totalFatToday}</span>
                        <span className="goalItem">
                            <span className="goalSpace">/</span>
                            <span className="goalValue">{`${fatGoal}`}</span>
                        </span>
                    </ListItem>
                </div>

                <div>
                    <PieChart
                        colors={['teal', 'purple', 'orange']}
                        className="pieChart"
                        series={[
                            {
                                data: [
                                    { id: 0, value: totalProteinToday, label: 'Total Protein' },
                                    { id: 1, value: totalFatToday, label: 'Total Fat' },
                                    { id: 2, value: totalCarbsToday, label: 'Total Carbs' }
                                ],
                                innerRadius: 25,
                                outerRadius: 90,
                                paddingAngle: 5,
                                cornerRadius: 5,
                                startAngle: 0,
                                endAngle: 360,
                                cx: 185,
                                // style: { fill: 'white', color: 'white' },
                                fontSize: 20
                            },
                        ]}
                        width={450}
                        height={200}
                    // sx={{fill: "white", color: "white"}}
                    />
                </div>
            </Stack>

            <Stack className="stack" spacing={2} ml={"50px"} alignItems={"center"} justifyContent={"center"}>
                <h4 className="sectionTitle">{"Add Meal Item To Tracker"}</h4>
                <div className="inputContainer">
                    <Box sx={{ minWidth: 230 }} >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label htmlFor="foodName">Food Name</label>
                            <input id="foodName" type="text" value={foodName} className="inputBox" onChange={(e) => setFoodName(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label htmlFor="cals">Calories</label>
                            <input id="cals" type="text" value={calories} className="inputBox" onChange={(e) => setCalories(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label htmlFor="protein">Protein</label>
                            <input id="protein" type="text" value={protein} className="inputBox" onChange={(e) => setProtein(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label htmlFor="carbohydrates">{"Carbohydrates "}</label>
                            <input id="carbohydrates" type="text" value={carbohydrates} className="inputBox" onChange={(e) => setCarbs(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label htmlFor="fat">Fat</label>
                            <input id="fat" type="text" value={fat} className="inputBox" onChange={(e) => setFat(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label htmlFor="servings">Servings</label>
                            <input id="servings" type="text" value={servings} className="inputBox" onChange={(e) => setServings(e.target.value)} />
                        </div>
                        {/* TODO */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label htmlFor="servings">Serving Size</label>
                            <input id="servingSize" type="text" value={servingSize} className="inputBox" onChange={(e) => setServingSize(e.target.value)} />
                        </div>
                    </Box>

                </div>
                <div className="mealTypeContainer">
                    <Box sx={{ width: 240 }}>
                        <FormControl error fullWidth sx={{ m: 1, width: 180 }}  >
                            <InputLabel>Meal Type</InputLabel>
                            <Select id="demo-simple-select" value={mealType} onChange={handleMealTypeChange} label="Filter" classes={{ root: classes.root, select: classes.selected }} >
                                <MenuItem value={EMPTY}>{EMPTY}</MenuItem>
                                <MenuItem value={BREAKFAST}>{BREAKFAST}</MenuItem>
                                <MenuItem value={LUNCH}>{LUNCH}</MenuItem>
                                <MenuItem value={DINNER}>{DINNER}</MenuItem>
                                <MenuItem value={SNACK}>{SNACK}</MenuItem>
                            </Select>
                            <Button variant="contained" color="success" size="large" className="button" onClick={handleAddFood}> Add Item </Button>
                        </FormControl>
                    </Box>
                </div>
                { // error message if not all fields filled in
                    <div className="errorMessage">
                        <p style={{ visibility: (allFieldsComplete) && "hidden" }}>
                            {errorMessage}
                        </p>
                    </div>
                }
            </Stack>
        </div>
    );

};

export default MealTracker;