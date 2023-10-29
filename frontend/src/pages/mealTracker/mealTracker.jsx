// Javascript for page displaying recommendations
import Box from "@material-ui/core/Box";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/navbar/navbar";
import { Link } from "react-router-dom";
import { AuthContext } from "../../utils/authentication/auth-context";
import { useState, useEffect, useContext } from 'react';
import "./mealTracker.scss";
import axios from "axios";
import { useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import { PieChart } from "@mui/x-charts/PieChart";

const useStyles = makeStyles((theme) => ({
    root: {
        color: "black",
    },
    selected: {
        color: "white"
    }
}));

const MealTracker = () => {

    const classes = useStyles();
    const [foodItems, setFoodItems] = useState([]); //the current items displayed in list
    const { user } = useContext(AuthContext);
    const userId = user._id;

    /* Food info corresponding to input boxes */
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [carbohydrates, setCarbs] = useState(0);
    const [servings, setServings] = useState(0);
    const [mealType, setMealType] = useState('');
    const [totalCals, setTotalCals] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalServings, setTotalServings] = useState(0);

    /* Load food items on page render */
    const isFirstRender = useRef(true); 
    useEffect(() => {
        // Get food items on load
        const getFoodItems = async () => {
            try {
                const response = await axios.get(`users/allFoods/${userId}`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });

                setFoodItems(response.data);

                let sumCalories = 0;
                let sumProtein = 0;
                let sumFat = 0;
                let sumCarbs = 0;
                let sumServings = 0;

                response.data.forEach( item => { //sum total nutrition amounts
                    sumCalories += isNaN(item.calories) ? 0 : item.calories * item.servings;
                    sumProtein += isNaN(item.protein) ? 0 : item.protein * item.servings;
                    sumFat += isNaN(item.fat) ? 0 : item.fat * item.servings;
                    sumCarbs += isNaN(item.carbohydrates) ? 0 : item.carbohydrates * item.servings;
                    sumServings += parseInt(item.servings);
                } );

                setTotalCals(sumCalories);
                setTotalProtein(sumProtein);
                setTotalFat(sumFat);
                setTotalCarbs(sumCarbs);
                setTotalServings(sumServings);

            } catch (error) {
                console.log(error);
            }
        };

        /* only run on first render */
        if (isFirstRender.current) {
            getFoodItems();
        }
        isFirstRender.current = false;
        // eslint-disable-next-line
    }, []);

    const handleAddFood = async () => {

        try {
            const res = await axios.put(
                `users/addFood/${userId}`,
                { foodName, calories, fat, protein, carbohydrates, servings, mealType },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );

            // Refresh the food items after editing
            setFoodItems(res.data.foods);
            setTotalCals(totalCals + calories*servings);
            setTotalProtein(totalProtein + protein*servings);
            setTotalFat(totalFat + fat*servings);
            setTotalCarbs(totalCarbs + carbohydrates*servings);
            setTotalServings(totalServings + parseInt(servings));

            // Clear the editedNutritionFacts state
            setFoodName('');
            setCalories('');
            setProtein('');
            setFat('');
            setCarbs('');
            setServings('');
            setMealType('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleMealTypeChange = (event) => {
        setMealType(event.target.value);
    }

    function listItem(item) { // display a menu item
        const name = item.foodName;
        const id = item.hash;

        return (
            <Link to={`/foodItemInfo/${id}`} className="link">
                <ListItem component="div" disablePadding button={true}>
                    <span className="header">{`${name}`}</span>
                </ListItem>
            </Link>
        );
    }

    return (
        <div className="menu">
            <Navbar />
            <div>
                <h4 className="moreSpace">{"View Your Meals Today:"}</h4>
                <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                    <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                        <List>
                            {foodItems.map((item) => listItem(item))}
                        </List>
                    </Paper>
                </Box>
                <h4 className="moreSpace">{`Total Daily Calories: ${totalCals}`}</h4>
                <PieChart
                    series={[
                        {
                        data: [
                            { id: 0, value: totalProtein, label: 'Total Protein' },
                            { id: 1, value: totalFat, label: 'Total Fat' },
                            { id: 2, value: totalCarbs, label: 'Total Carbs' },
                            { id: 3, value: totalServings, label: 'Total Servings' }
                        ],
                        innerRadius: 25,
                        outerRadius: 90,
                        paddingAngle: 5,
                        cornerRadius: 5,
                        startAngle: 0,
                        endAngle: 360,
                        cx: 185,
                        },
                    ]}
                    width={400}
                    height={200}
                />
            </div>
            <Stack className="stack" spacing={2} ml={"50px"}>
                <h4 className="moreSpace">{"Add Meal Item To Tracker:"}</h4>
                <div className="filter">
                    <Box sx={{ minWidth: 120 }}>
                        <div> {"Food Name: "}</div>
                        <input type="name" value={foodName} onChange={(e) => setFoodName(e.target.value)}/>
                        <div> {"Calories: "}</div>
                        <input type="cals" value={calories} onChange={(e) => setCalories(e.target.value)}/>
                        <div> {"Protein: "}</div>
                        <input type="protein" value={protein} onChange={(e) => setProtein(e.target.value)}/>
                        <div> {"Fat: "}</div>
                        <input type="fat" value={fat} onChange={(e) => setFat(e.target.value)}/>
                        <div> {"Carbohydrates: "}</div>
                        <input type="carbohydrates" value={carbohydrates} onChange={(e) => setCarbs(e.target.value)}/>
                        <div> {"Servings: "}</div>
                        <input type="servings" value={servings} onChange={(e) => setServings(e.target.value)}/>
                    </Box>
                </div>
                <div className="filter2">
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}  >
                            <InputLabel>Meal Type</InputLabel>
                            <Select id="demo-simple-select" value={mealType} onChange={handleMealTypeChange} label="Filter" classes={{ root: classes.root, select: classes.selected }} >
                                <MenuItem value={"Breakfast"}>{`Breakfast`}</MenuItem>
                                <MenuItem value={"Lunch"}>{`Lunch`}</MenuItem>
                                <MenuItem value={"Dinner"}>{`Dinner`}</MenuItem>
                                <MenuItem value={"Snack"}>{`Snack`}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Button variant="contained" color="success" size="large" className="button" onClick={handleAddFood}> Add Item </Button>
                </div>
            </Stack>
        </div>
    );

};

export default MealTracker;