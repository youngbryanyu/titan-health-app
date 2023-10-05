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
import "./recommendations.scss";
import axios from "axios";
import { useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';

//the layout will be new recommendation page that has a 
//list component on left, a filter component on right
//1st filter option is "Give Me Recommendations Based On Saved Items"
//this needs to first get all saved items
//have a weightage for attributes (For example, Vegan - 4, Vegetarian - 1, Eggs - 6, Peanuts - 0 ...)
//go through each saved item and add +1 to weightage if attribute is true in that item
//at end select the attributes that are greater than or equal to 3
//(if no attributes greater than 3, return all items)
//(also indicate to user to save more items to get more personalized recommendations)
//then return menu items that fit those more heavily weighted attributes
//2nd filter option is "Give Me Recommendations Based On My Prefs/Rests"
//just get all items that fit the users prefs & rests
//limit results to 15 items

const useStyles = makeStyles((theme) => ({
    root: {
        color: "black",
    },
    selected: {
        color: "white"
    }
}));

const Recommendations = () => {

    const classes = useStyles();
    const [foodItems, setFoodItems] = useState([]); //the current items displayed in list
    const { user } = useContext(AuthContext);
    const userId = user._id;

    /* Food info corresponding to input boxes */
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbohydrates, setCarbs] = useState('');
    const [servings, setServings] = useState('');
    const [mealType, setMealType] = useState('');

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
        console.log(event.target.value);
    }

    function listItem(item) { // display a menu item
        const name = item.foodName;
        const id = item.hash;

        return (
            <Link to={`/foodInfo/${id}`} className="link">
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
                <h4 className="moreSpace">{"View Meal Tracker Items:"}</h4>
                <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                    <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                        <List>
                            {foodItems.map((item) => listItem(item))}
                        </List>
                    </Paper>
                </Box>
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

export default Recommendations;