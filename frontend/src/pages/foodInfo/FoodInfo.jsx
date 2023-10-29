// Javascript for page displaying info related to a menu item
// import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/navbar";
import "./foodInfo.scss";
import { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { IconButton, Tooltip } from "@material-ui/core";
import Info from '@mui/icons-material/Info';
import StarOutline from '@mui/icons-material/StarOutline';
import Star from '@mui/icons-material/Star';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import Bookmark from '@mui/icons-material/Bookmark';
import { AuthContext } from "../../utils/authentication/auth-context";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from "axios";
import Button from '@mui/material/Button';
import { makeStyles } from "@material-ui/core/styles";
import ROUTES from "../../routes";
import { Link, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        color: "black",
    },
    selected: {
        color: "white"
    }
}));

const FoodInfo = () => {


    const handleMealTypeChange = (event) => {
        setMealType(event.target.value);
    }

    /* Rating Info */
    const [starClick1, setStarClick1] = useState(false);
    const [starClick2, setStarClick2] = useState(false);
    const [starClick3, setStarClick3] = useState(false);
    const [starClick4, setStarClick4] = useState(false);
    const [starClick5, setStarClick5] = useState(false);
    const [savedClick, setSavedClick] = useState(false);

    /* Food info corresponding to input boxes */
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbohydrates, setCarbs] = useState('');
    const [servings, setServings] = useState('');
    const [mealType, setMealType] = useState('');

    const [avg, setAvg] = useState("N/A"); // tracks avg rating
    const { user } = useContext(AuthContext);
    const userId = user._id;
    const classes = useStyles();
    let { foodItemHash } = useParams(); // this will be undefined if no params
    const [foodItem, setFoodItem] = useState({
        foodName: "",
        calories: "",
        fat: "",
        protein: "",
        carbohydrates: "",
        servings: "",
        mealType: "",
        hash: ""
    }); //tracks food item

    const handleClick0 = () => {
        setStarClick1(false);
        setStarClick2(false);
        setStarClick3(false);
        setStarClick4(false);
        setStarClick5(false);
        // setScore(0);
    }
    const handleClick1 = () => {
        setStarClick1(true);
        setStarClick2(false);
        setStarClick3(false);
        setStarClick4(false);
        setStarClick5(false);
        // setScore(1);
    }
    const handleClick2 = () => {
        setStarClick1(true);
        setStarClick2(true);
        setStarClick3(false);
        setStarClick4(false);
        setStarClick5(false);
        // setScore(2);
    }
    const handleClick3 = () => {
        setStarClick1(true);
        setStarClick2(true);
        setStarClick3(true);
        setStarClick4(false);
        setStarClick5(false);
        // setScore(3);
    }
    const handleClick4 = () => {
        setStarClick1(true);
        setStarClick2(true);
        setStarClick3(true);
        setStarClick4(true);
        setStarClick5(false);
        // setScore(4);
    }
    const handleClick5 = () => {
        setStarClick1(true);
        setStarClick2(true);
        setStarClick3(true);
        setStarClick4(true);
        setStarClick5(true);
        // setScore(5);
    }
    const handleSavedClick = () => {
        setSavedClick(!savedClick);
    }

    /**
    *   Get item on page render
    */
    const isFirstRender = useRef(true); // don't do anything on first render
    useEffect(() => {
        
        const getFoodItemInfo = async () => {
            try {
                const response = await axios.get(`/users/aFoodItem/${userId}/${foodItemHash}`,
                { headers: { token: `Bearer ${user.accessToken}` } });
                const item = response.data;
                setFoodItem({
                    foodName: item.foodName,
                    calories: item.calories,
                    fat: item.fat,
                    protein: item.protein,
                    carbohydrates: item.carbohydrates,
                    servings: item.servings,
                    mealType: item.mealType,
                    hash: item.hash
                });
                console.log(response.data);
            } catch (error) { console.log(error) };
        };

        if (isFirstRender.current) {
            if (foodItemHash != null) {
                getFoodItemInfo();
            }
        }
        isFirstRender.current = false;
        // eslint-disable-next-line
    }, []);

    const handleEditFood = async () => {

        try {
            const hash = foodItemHash;
            const res = await axios.put(
                `/users/editFood/${userId}`,
                { foodName, calories, fat, protein, carbohydrates, servings, mealType, hash },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );

            // Refresh the food items after editing
            setFoodItem({
                    foodName: foodName,
                    calories: calories,
                    fat: fat,
                    protein: protein,
                    carbohydrates: carbohydrates,
                    servings: servings,
                    mealType: mealType,
                    hash: foodItemHash
                });

            // Clear the previous state
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

    const handleDeleteFood = async () => {
        try {
            const hash = foodItemHash;
            const res = await axios.delete(
                `/users/deleteFood/${userId}/${hash}`,
                { headers: { token: `Bearer ${user.accessToken}` } }
            );
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="foodInfo">
            <Navbar />

            <Box sx={{ // info for nutrition facts (sx provides inline style information for this component)
                background: '#0b0b0b',
                width: .4,
                maxHeight: 400,
                position: 'relative',
                float: 'left',
                display: 'inline',
                ml: 6,
                top: 85,
                borderRadius: 5,
                overflow: 'auto',
            }}>
                <List>
                    <ListItem sx={{
                        background: '#242424',
                        width: .98,
                        mx: 'auto',
                        borderRadius: 8,
                    }}>
                        <Typography style={{ color: "#ebc034" }} fontWeight="bold">
                            Nutrition Facts for: &nbsp; {foodItem.foodName}
                        </Typography>
                    </ListItem>
                    <ListItem key="calories">
                        <Typography fontWeight="bold">
                            Calories: {foodItem.calories}
                        </Typography>
                    </ListItem>
                    <ListItem key="fat">
                        <Typography fontWeight="bold">
                            Fat: {foodItem.fat}
                        </Typography>
                    </ListItem>
                    <ListItem key="protein">
                        <Typography fontWeight="bold">
                            Protein: {foodItem.protein}
                        </Typography>
                    </ListItem>
                    <ListItem key="carbohydrates">
                        <Typography fontWeight="bold">
                            Carbohydrates: {foodItem.carbohydrates}
                        </Typography>
                    </ListItem>
                    <ListItem key="servings">
                        <Typography fontWeight="bold">
                            Servings: {foodItem.servings}
                        </Typography>
                    </ListItem>
                    <ListItem key="mealType">
                        <Typography fontWeight="bold">
                            Meal Type: {foodItem.mealType}
                        </Typography>
                    </ListItem>
                </List>
            </Box>

            <Box sx={{ // info for tags
                background: '#0b0b0b',
                width: .2,
                maxHeight: 425,
                position: 'relative',
                float: 'left',
                display: 'inline',
                ml: 6,
                top: 85,
                borderRadius: 5,
                overflow: 'auto',
            }}>
                <List>
                    <ListItem sx={{
                        background: '#242424',
                        width: .98,
                        mx: 'auto',
                        borderRadius: 8,
                    }}>
                        <Typography fontWeight="bold">
                            Edit Item:
                        </Typography>
                    </ListItem>
                    <ListItem key="name">
                        <Typography fontWeight="bold">
                            Food Name:  
                        </Typography>
                        <input type="name" value={foodName} onChange={(e) => setFoodName(e.target.value)}/>
                    </ListItem>
                    <ListItem key="calories">
                        <Typography fontWeight="bold">
                            Calories:
                        </Typography>
                        <input type="cals" value={calories} onChange={(e) => setCalories(e.target.value)}/>
                    </ListItem>
                    <ListItem key="fat">
                        <Typography fontWeight="bold">
                            Fat:
                        </Typography>
                        <input type="fat" value={fat} onChange={(e) => setFat(e.target.value)} />
                    </ListItem>
                    <ListItem key="protein">
                        <Typography fontWeight="bold">
                            Protein:
                        </Typography>
                        <input type="protein" value={protein} onChange={(e) => setProtein(e.target.value)}/>
                    </ListItem>
                    <ListItem key="carbs">
                        <Typography fontWeight="bold">
                            Carbs:
                        </Typography>
                        <input type="carbs" value={carbohydrates} onChange={(e) => setCarbs(e.target.value)}/>
                    </ListItem>
                    <ListItem key="servings">
                        <Typography fontWeight="bold">
                            Servings:
                        </Typography>
                        <input type="servings" value={servings} onChange={(e) => setServings(e.target.value)}/>
                    </ListItem>
                    <ListItem>
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
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" color="success" size="large" className="button" onClick={handleEditFood}> Update Item </Button>
                    </ListItem>
                </List>
            </Box>

            <Box sx={{ // info for locations served at today
                background: '#0b0b0b',
                width: .2,
                maxHeight: 400,
                position: 'relative',
                float: 'left',
                display: 'inline',
                ml: 6,
                top: 85,
                borderRadius: 10,
                overflow: 'auto',
            }}>
                <List>
                    <ListItem sx={{
                        background: '#242424',
                        width: .98,
                        mx: 'auto',
                        borderRadius: 8,
                    }}>
                        <Typography fontWeight="bold">
                            Delete This Item:
                        </Typography>
                        <Link to={ROUTES.MEAL_TRACKER} className="link" onClick={handleDeleteFood}>
                            <Button variant="contained" color="error" size="large" className="button"> Delete </Button>
                        </Link>
                    </ListItem>
                </List>
            </Box>

            <Box sx={{
                background: '#0b0b0b',
                width: 340,
                height: 'auto',
                overflow: 'hidden', //do not remove, will break the ratings appearance and idk why
                position: 'absolute',
                ml: 6, //left margin (percent of screen)
                mt: 63, //top margin (percent of screen)
                borderRadius: 10,
            }}>
                <Tooltip title={`Average Rating: ${avg}`} placement="bottom">
                    <IconButton color="inherit">
                        <Info />
                    </IconButton>
                </Tooltip>
                <IconButton color="inherit" onClick={handleClick1}>
                    {starClick1 ? <Star /> : <StarOutline />}
                </IconButton>
                <IconButton color="inherit" onClick={handleClick2}>
                    {starClick2 ? <Star /> : <StarOutline />}
                </IconButton>
                <IconButton color="inherit" onClick={handleClick3}>
                    {starClick3 ? <Star /> : <StarOutline />}
                </IconButton>
                <IconButton color="inherit" onClick={handleClick4}>
                    {starClick4 ? <Star/> : <StarOutline/>}
                </IconButton>
                <IconButton color="inherit" onClick={handleClick5}>
                    {starClick5 ? <Star /> : <StarOutline />}
                </IconButton>
                <IconButton color="inherit" onClick={handleSavedClick}>
                    {savedClick ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
            </Box>
            <Box sx={{ ml: 6, mt: 70, width: .9, height: 'auto', position: 'absolute' }}>
                <Box sx={{
                    borderColor: '#242424',
                    p: 1,
                    m: 1,
                    borderRadius: 4,
                    border: '1px solid',
                    width: 1,
                    height: 'auto',
                    display: 'block',
                }}>
                    <Typography fontWeight="bold">
                        Ingredients: &nbsp;
                    </Typography>
                </Box>
                <Box sx={{
                    borderColor: '#242424',
                    p: 1,
                    m: 1,
                    borderRadius: 4,
                    border: '1px solid',
                    height: 'auto',
                    width: 1,
                    display: 'block',
                }}>
                    <Typography style={{ color: "#f74d40" }} fontWeight="bold" color='red'>
                        Disclaimer: &nbsp;
                    </Typography>
                    Menus subject to change. All nutritional information is based on the listed menu items. Any additions to ingredients or condiments will change the nutritional value. All information provided is believed to be accurate and reliable as of the date of posting. Nutritional information may vary by location due to product substitutions or product availability.
                </Box>
            </Box>
        </div>
    );
};



export default FoodInfo;