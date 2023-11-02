// Javascript for page displaying info related to a menu item
import Navbar from "../../components/navbar/navbar";
import "./foodInfo.scss";
import { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { AuthContext } from "../../utils/authentication/auth-context";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper'; // Sheet is replaced by Paper
import Box from '@mui/material/Box';
import axios from "axios";
import Button from '@mui/material/Button';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        color: "black",
    },
    selected: {
        color: "white",
    },
}));


const FoodInfo = () => {
    const classes = useStyles();


    const [starClick1, setStarClick1] = useState(false);
    const [starClick2, setStarClick2] = useState(false);
    const [starClick3, setStarClick3] = useState(false);
    const [starClick4, setStarClick4] = useState(false);
    const [starClick5, setStarClick5] = useState(false);
    const [savedClick, setSavedClick] = useState(false);
    const [score, setScore] = useState(0); // tracks users rating of item
    const [avg, setAvg] = useState("N/A"); // tracks avg rating
    // const [saved, setSaved] = useState(false); // whether or not item is saved --> unused 
    const { user } = useContext(AuthContext);
    let { menuItemID } = useParams(); // this will be undefined if no params
    const [menuItem, setMenuItem] = useState({
        _id: "",
        ID: "",
        name: "",
        courtData: [],
        dateServed: "",
        isVegetarian: false,
        allergens: [],
        nutritionFacts: [],
        ingredients: "",
        __v: 0
    }); //tracks menu item

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

     /* fields for meal type */
     const SELECT_MEAL = 0;
     const BREAKFAST = 1;
     const LUNCH = 2;
     const DINNER = 3;
     const SNACK = 4;
     const [mealType, setMealType] = useState(SELECT_MEAL);
     const mealTypes = ["", "Breakfast", "Unknown", "Lunch", "Snack", "Dinner"];

    /**
    * Load initial ratings & get item & get saved item on page render
    */
    const isFirstRenderRatings = useRef(true); // don't do anything on first render
    useEffect(() => {
        // Get initial rating then set rating of this item to that
        const setInitialRating = async () => {
            try {
                const response = await axios.get('/ratings/' + user.username + '/' + menuItemID);
                let rating = response.data;

                if (rating === "No doc found") { //means no rating for this item
                    // leave all stars blank
                    handleClick0();
                } else { //find rating and call respective function

                    rating = response.data.rating;

                    switch (rating) {
                        default:
                            handleClick0();
                            break;
                        case 1:
                            handleClick1();
                            break;
                        case 2:
                            handleClick2();
                            break;
                        case 3:
                            handleClick3();
                            break;
                        case 4:
                            handleClick4();
                            break;
                        case 5:
                            handleClick5();
                            break;

                    }

                }

            } catch (error) {
                console.log(error);
            }
        };

        const getIntialAvgRating = async () => {
            try {
                const response = await axios.get(`/ratings/${menuItemID}`);
                const rating = response.data.avgRating;
                if (rating != null) setAvg(rating);
            } catch (error) { console.log(error) };
        };

        const getMenuItemInfo = async () => {
            try {
                const response = await axios.get(`/menuInfo/item/${menuItemID}`);
                const item = response.data;
                setMenuItem({
                    _id: item._id,
                    ID: item.ID,
                    name: item.name,
                    courtData: item.courtData,
                    dateServed: item.dateServed,
                    isVegetarian: item.isVegetarian,
                    allergens: item.allergens,
                    nutritionFacts: item.nutritionFacts,
                    ingredients: item.ingredients,
                    __v: item.__v,
                });
                console.log(menuItem);
            } catch (error) { console.log(error) };

        };

        const getSavedStatus = async () => {
            try {
                const response = await axios.get(`/saved/${user.username}/${menuItemID}`);
                const savedStatus = response.data.saved;
                if (savedStatus != null) {
                    // setSaved(savedStatus); // unused
                    setSavedClick(savedStatus); //this is a test comment
                }
            } catch (error) { console.log(error) };
        };

        if (isFirstRenderRatings.current) {
            if (menuItemID != null) {
                setInitialRating();
                getIntialAvgRating();
                getMenuItemInfo();
                getSavedStatus();
            }
        }
        isFirstRenderRatings.current = false;
        // eslint-disable-next-line
    }, []);

    /**
     * Update the rating in the database when rating changes, not on first render though. Triggered by useEffect above
     */
    const isFirstRender_updateRatingsDB = useRef(true); // don't do anything on first render
    useEffect(() => {
        if (isFirstRender_updateRatingsDB.current) {
            isFirstRender_updateRatingsDB.current = false;
            return; // don't update DB on initial render
        }

        const updateRatingInDB = async () => {
            try {
                var rating;
                if (starClick5) {
                    rating = 5
                } else if (starClick4) {
                    rating = 4
                } else if (starClick3) {
                    rating = 3
                } else if (starClick2) {
                    rating = 2
                } else if (starClick1) {
                    rating = 1
                }
                await axios.post('/ratings', {
                    username: user.username,
                    menuItemID: menuItemID,
                    rating: rating
                });
                console.log("successfully updated rating of menuItemId: " + menuItemID);
            } catch (error) {
                console.log("failed to update rating: " + error);
            } finally {
                setScore(rating)
            }
        }
        if (menuItemID != null) {
            updateRatingInDB(); // update the preferences in the database
        }// eslint-disable-next-line
    }, [starClick1, starClick2, starClick3, starClick4, starClick5]);

    /* useEffect to udpate avg rating of menu item on page when user rates something */
    useEffect(() => {
        async function updateAvgRating() {
            try {
                const response = await axios.get('/ratings/' + menuItemID);
                // console.log("successfully updated rating of menuItemId: " + menuItemID);
                // console.log(response.data.avgRating)
                setAvg(response.data.avgRating);

            } catch (error) {
                console.log("failed to update avg rating: " + error);
            }
        }
        updateAvgRating();
        // eslint-disable-next-line
    }, [score])


    /* Get nutrition info */
    const nutrition = menuItem.nutritionFacts.map((fact) =>
        <ListItem key={fact.Name} style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography fontWeight="bold" style={{ color: 'white' }}>
                {fact.Name}
            </Typography>
            <div>
                {fact.LabelValue}
            </div>
        </ListItem>

    );

    /* Get dietary tag info */
    const tags1 = menuItem.allergens.map((tag) =>
        vegTags(tag)
    );
    const tags2 = menuItem.allergens.map((tag) =>
        nonVegTags(tag)
    );
    function vegTags(tag) {
        if (tag.Name === "Vegan" || tag.Name === "Vegetarian") {
            if (tag.Value) {
                return (
                    <ListItem key={tag.Name} style={{ color: 'white' }}>
                        Is&nbsp;{tag.Name}
                    </ListItem>
                )
            } else {
                return (
                    <ListItem key={tag.Name} style={{ color: 'white' }}>
                        Is not&nbsp;{tag.Name}
                    </ListItem>
                )
            }
        }
    }
    function nonVegTags(tag) {
        if (tag.Name === "Vegan" || tag.Name === "Vegetarian") {
            return;
        }
        if (tag.Value) {
            return (
                <ListItem key={tag.Name} style={{ color: 'white' }}>
                    Contains&nbsp;{tag.Name}
                </ListItem>
            )
        } else {
            return (
                <ListItem key={tag.Name} style={{ color: 'white' }}>
                    Does not contain&nbsp;{tag.Name}
                </ListItem>
            )
        }
    }

    /* Get the locations an item is served at today */
    const locations = menuItem.courtData.map((courtDataItem) =>
        courtDataInfo(courtDataItem)
    )
    function courtDataInfo(courtDataItem) {
        return (
            <ListItem key="{courtDataItem}" style={{ color: 'white' }}>
                &nbsp;{courtDataItem[0] + " - " + courtDataItem[1] + " (" + courtDataItem[2] + ")"}
            </ListItem>
        )
    }

    /**
     * Update the savedStatus in the database when saved changes, not on first render though.
     */
    const isFirstRender_updateSavedDB = useRef(true); // don't do anything on first render
    useEffect(() => {
        if (isFirstRender_updateSavedDB.current) {
            isFirstRender_updateSavedDB.current = false;
            return; // don't update DB on initial render
        }

        const updateSavedStatusInDB = async () => {
            try {
                await axios.post('/saved', {
                    username: user.username,
                    menuItemID: menuItemID,
                    saved: savedClick
                });
                console.log("successfully updated savedStatus of menuItemId: " + menuItemID);
            } catch (error) {
                console.log("failed to update savedStatus: " + error);
            }
        }

        if (menuItemID != null) {
            updateSavedStatusInDB(); //update savedStatus of item in DB
        }
        // eslint-disable-next-line
    }, [savedClick]);

    return (
        <div className="foodInfo">
            <Navbar />
            <Paper sx={{ // info for nutrition facts (sx provides inline style information for this component)
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

                <div style={{ position: 'relative' }}>
                    {/* Fixed Header */}
                    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                        <ListItem sx={{
                            background: '#242424',
                            width: .98,
                            mx: 'auto',
                            borderRadius: 5,
                        }}>
                            <Typography style={{ color: "white" }} fontWeight="bold">
                                Nutrition Facts for: &nbsp; <span style={{ color: "#ebc034" }}>{menuItem.name}</span>
                            </Typography>
                        </ListItem>
                    </div>

                    {/* Scrollable Content */}
                    <List style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {nutrition}
                    </List>
                </div>
            </Paper>

            <Paper sx={{ // info for tags
                background: '#0b0b0b',
                width: .2,
                maxHeight: 400,
                position: 'relative',
                float: 'left',
                display: 'inline',
                ml: 6,
                top: 85,
                borderRadius: 5,
                overflow: 'auto',
            }}>
                {/* Dietary Tags List */}
                <div style={{ position: 'relative' }}>
                    {/* Fixed Header */}
                    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                        <ListItem sx={{
                            background: '#242424',
                            width: .98,
                            mx: 'auto',
                            borderRadius: 5,
                        }}>
                            <Typography fontWeight="bold" color={"white"}>
                                Dietary Tags:
                            </Typography>
                        </ListItem>
                    </div>

                    {/* Scrollable Content */}
                    <List style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {tags1}
                        {tags2}
                    </List>
                </div>
            </Paper>

            <Paper sx={{ // info for locations served at today
                background: '#0b0b0b',
                width: .2,
                maxHeight: 400,
                position: 'relative',
                float: 'left',
                display: 'inline',
                ml: 6,
                top: 85,
                borderRadius: 5,
                overflow: 'auto',
            }}>
                {/* Locations Served At Today List */}
                <div style={{ position: 'relative' }}>
                    {/* Fixed Header */}
                    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                        <ListItem sx={{
                            background: '#242424',
                            width: .98,
                            mx: 'auto',
                            borderRadius: 5,
                        }}>
                            <Typography fontWeight="bold" color={"white"}>
                                Locations Served At Today:
                            </Typography>
                        </ListItem>
                    </div>

                    {/* Scrollable Content */}
                    <List style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {locations}
                    </List>
                </div>
            </Paper>

            {/* <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}> */}

            <Box sx={{
                background: '#0b0b0b',
                width: .35,
                height: 'auto',
                overflow: 'hidden', //do not remove, will break the ratings appearance and idk why
                position: 'absolute',
                ml: 6, //left margin (percent of screen)
                mt: 63, //top margin (percent of screen)
                borderRadius: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px' // Add some padding to ensure elements aren't touching the edges
            }}>

                <div style={{ display: 'flex', marginRight: 5 }}>
                    <Tooltip title={"Click the stars to rate the menu item. Click the bookmark icon to save (favorite) the item."} placement="bottom">
                        <IconButton color="inherit">
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton color="inherit" onClick={handleClick1}>
                        {starClick1 ? <StarIcon /> : <StarOutlineIcon />}
                    </IconButton>
                    <IconButton color="inherit" onClick={handleClick2}>
                        {starClick2 ? <StarIcon /> : <StarOutlineIcon />}
                    </IconButton>
                    <IconButton color="inherit" onClick={handleClick3}>
                        {starClick3 ? <StarIcon /> : <StarOutlineIcon />}
                    </IconButton>
                    <IconButton color="inherit" onClick={handleClick4}>
                        {starClick4 ? <StarIcon /> : <StarOutlineIcon />}
                    </IconButton>
                    <IconButton color="inherit" onClick={handleClick5}>
                        {starClick5 ? <StarIcon /> : <StarOutlineIcon />}
                    </IconButton>
                    <IconButton color="inherit" onClick={handleSavedClick}>
                        {savedClick ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                </div>

                {/* avg rating info */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 16, marginLeft: 20 }}>
                        {`Average Rating: ${avg}`}
                    </span>
                </div>
            </Box>

            {/* Box for form field and button */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '10px',
                position: "absolute",
                ml: 80, //left margin (percent of screen)
                mt: 60, //top margin (percent of screen),
                background: '#0b0b0b',
                padding: 1,
                borderRadius: 5
            }}>
                <span style={{ marginRight: 5 }}>
                    <input
                        type="number"
                        placeholder="Servings"
                        style={{
                            padding: '5px',
                            border: 'none',
                            borderRadius: '4px',
                            height: '40px', // Adjust height to align with button
                            // marginTop: '0px',
                            marginRight: '-5px'
                        }}
                    />
                </span>

                <FormControl error fullWidth sx={{ m: 1, width: 200, height: 50, marginTop: 0, marginBottom: .5 }}>
                    <InputLabel>Meal type</InputLabel>
                    <Select
                        id="demo-simple-select"
                        value={mealType}
                        label="Filter"
                        // onChange={handleMeals}
                        classes={{ root: classes.root, select: classes.selected }}
                    >
                        <MenuItem value={SELECT_MEAL}>{`Select meal type`}</MenuItem>
                        <MenuItem value={BREAKFAST}>{`Breakfast`}</MenuItem>
                        <MenuItem value={LUNCH}>{`Lunch`}</MenuItem>
                        <MenuItem value={DINNER}>{`Dinner`}</MenuItem>
                        <MenuItem value={SNACK}>{`Snack`}</MenuItem>
                    </Select>
                </FormControl>
                <span>
                    <Button
                        variant="contained"
                        onClick={() => {/* Your click handler function here */ }}
                        style={{
                            backgroundColor: 'goldenrod',
                            color: 'white',
                            height: '50px',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            // marginTop: '0px'
                        }}>
                        Add to Tracker
                    </Button>
                </span>
            </Box>

            {/* sucess and error message*/}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '10px',
                position: "absolute",
                ml: 140, //left margin (percent of screen)
                mt: 50, //top margin (percent of screen),
                // background: '#0b0b0b',
                padding: 15,
                borderRadius: 5
            }}>
                <span>ERROR </span>
            </Box>


            {/* ingredients  */}
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
                    {menuItem.ingredients}
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