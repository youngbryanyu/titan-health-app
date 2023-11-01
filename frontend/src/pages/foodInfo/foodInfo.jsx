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


const FoodInfo = () => {
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
                console.log("successfully updated rating of menuItemId: " + menuItemID);
                console.log(response.data.avgRating)
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
        <ListItem key="{fact.Name}">
            <Typography fontWeight="bold">
                {fact.Name}: &nbsp;
            </Typography>
            {fact.LabelValue}
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
                    <ListItem key="{tag.Name}">
                        Is&nbsp;{tag.Name}
                    </ListItem>
                )
            } else {
                return (
                    <ListItem key="{tag.Name}">
                        Is not&nbsp;{tag.Name}
                    </ListItem>
                )
            }
        }
    }
    function nonVegTags(tag) {
        if (tag.Name === "Vegan" || tag.Name === "Vegetarian") {
            return
        }
        if (tag.Value) {
            return (
                <ListItem key="{tag.Name}">
                    Contains&nbsp;{tag.Name}
                </ListItem>
            )
        } else {
            return (
                <ListItem key="{tag.Name}">
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
            <ListItem key="{courtDataItem}">
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
                        <Typography style={{ color: "#ebc034" }} fontWeight="bold">
                            Nutrition Facts for: &nbsp; {menuItem.name}
                        </Typography>
                    </ListItem>
                    {nutrition}
                </List>
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
                            Tags:
                        </Typography>
                    </ListItem>
                    {tags1}
                    {tags2}
                </List>
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
                            Locations Served At Today:
                        </Typography>
                    </ListItem>
                    {locations}
                </List>
            </Paper>

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