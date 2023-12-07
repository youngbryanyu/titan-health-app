// Javascript for page displaying recommendations
import { makeStyles } from '@mui/styles';
import Navbar from "../../components/navbar/navbar";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../utils/authentication/auth-context";
import "./recommendedMenuItems.scss";
import axios from "axios";
import { useRef } from "react";
import {
	Box,
	List,
	ListItem,
	Paper,
    InputLabel,
	FormGroup,
    FormControlLabel,
    MenuItem, 
    FormControl,
    Select,
    Checkbox,
    Stack
} from "@mui/material";

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

const RecommendedMenuItems = () => {

    const classes = useStyles();
    const [recsSaved, setRecsSaved] = useState([""]); //keep track of recs of saved items
    const [courtsMenu, setCourtsMenu] = useState([""]); //the current items displayed in list
    const [recsPrefsRests, setRecsPrefsRests] = useState([""]); //keep track of recs of prefs and rests

    // eslint-disable-next-line
    const [message, setMessage] = useState(""); // currently unused, can probably delete

    const { user } = useContext(AuthContext);
    let userId = user._id;
    const loading = useRef(true);
    const noItems = useRef(false);

    /* fields for recommendation type */
    const BASED_ON_PREFS = 0;
    const BASED_ON_SAVED = 1;
    const [recommendationType, setRecommendationType] = useState(BASED_ON_PREFS);

    const [menuBeforeSortPop, setMenuBeforeSortPop] = useState([]); // sort the menu items based on the rating
    const [shouldSortPop, setShouldSortPop] = useState(false); //should sort based ff item popularity

    /* fields for meal type */
    const ALL_MEALS = 0;
    const BREAKFAST = 1;
    const BRUNCH = 2;
    const LUNCH = 3;
    const LATE_LUNCH = 4
    const DINNER = 5
    const [mealType, setMealType] = useState(ALL_MEALS);
    const mealTypes = ["", "Breakfast", "Unknown", "Lunch", "Snack", "Dinner"];

    /* get recommendations based on saved items */
    async function getRecommendationsBasedOnSavedItems(mealType) {
        try {
            let response;

            /* user has no saved items */
            response = await axios.get(`/saved/allSaved/${userId}`);
            if (response.data.length === 0) {
                loading.current = false; // not loading    
                setCourtsMenu([]);
                setRecsSaved([]);
                return;
            }

            if (mealType === ALL_MEALS) { /* all types of meals */
                // TODO: change all to userId
                response = await axios.get(`/recommendations/saved/${userId}`);
            } else { /* specific meal type */
                response = await axios.get(`/recommendations/saved/${userId}/${mealType}`);
            }

            console.log(response.data);
            const prefsRestsObj = response.data;

            if (prefsRestsObj.message !== "All Good!") { /* if not all good set to empty  */
                loading.current = false; // not loading    
                setCourtsMenu([]);
                setRecsSaved([]);
                setMessage(prefsRestsObj.message);
            } else {
                // get items matching prefs and rests
                const selectedMealType = mealTypes[mealType] // get selected meal type
                const res = await axios.post("/menuInfo/prefsAndRests/" + selectedMealType, {
                    preferences: prefsRestsObj.preferences,
                    restrictions: prefsRestsObj.restrictions
                });
                

                const items = res.data;
                loading.current = false // not loading
                if (!items || items.length === 0) {
                    noItems.current = true; // no items
                    setCourtsMenu([]);
                    setRecsSaved([]);
                } else {
                    setCourtsMenu(items);
                    setRecsSaved(items);
                }

                setMessage(prefsRestsObj.message);
            }
        } catch (error) {
            loading.current = false // not loading
            setCourtsMenu([]);
            setRecsSaved([]);
            console.log(error)
        };
    };

    /* get recommendations based on prefs and rests */
    async function getRecommendationsBasedOnPrefsRests(mealType) {
        try {
            // first do two get calls to get the users prefs and rests
            // then do a third call to get the items matching those prefs and rests
            const prefsResponse = await axios.get('users/preferences/' + userId, {
                headers: {
                    token: "Bearer " + user.accessToken 
                }
            });  
            let prefs = [];
            if (prefsResponse) {
                prefs = prefsResponse.data;
            } /* this never runs if we get an axios error */

            const restsResponse = await axios.get('users/restrictions/' + userId, {
                headers: {
                    token: "Bearer " + user.accessToken 
                }
            });            
            let rests = [];
            if (restsResponse) {
                rests = restsResponse.data;
            } /* this never runs if we get an axios error */

            /* edge case: since prefs and rests are null for the user initially and cause axios to return error */
            /* if a user unchecks prefs/rests and they have none it won't be null */
            if (prefs.length === 0 && rests.length === 0) {
                loading.current = false // not loading
                setCourtsMenu([]);
                setRecsPrefsRests([]);
                return;
            }

            const selectedMealType = mealTypes[mealType] // get selected meal type
            // console.log(selectedMealType);
            const response = await axios.post(`/menuInfo/prefsAndRests/` + selectedMealType, {
                preferences: prefs,
                restrictions: rests
            });

            const courtsItems = response.data;
            loading.current = false // not loading
            // console.log(courtsItems)
            if (courtsItems.length === 0) {
                noItems.current = true;
            }
            setCourtsMenu(courtsItems);
            setRecsPrefsRests(courtsItems);
        } catch (error) {
            loading.current = false // not loading
            setCourtsMenu([]);
            setRecsPrefsRests([]);
            console.log(error)
        };
    };

    /* when user changes recommendation type */
    const handleRecTypeChange = (event) => { // handling the filters options
        setShouldSortPop(false); // reset sorting when user changes option
        loading.current = true; // loading
        noItems.current = false;

        if (event.target.value === BASED_ON_SAVED) {
            setRecommendationType(BASED_ON_SAVED)
        } else if (event.target.value === BASED_ON_PREFS) {
            setRecommendationType(BASED_ON_PREFS)
        }
    };

    /* when user changes meal type */
    const handleMealChange = (event) => {
        setShouldSortPop(false); // reset sorting when user changes option
        loading.current = true; // loading
        noItems.current = false;

        if (event.target.value === ALL_MEALS) {
            setMealType(ALL_MEALS)
        } else if (event.target.value === BREAKFAST) {
            setMealType(BREAKFAST)
        } else if (event.target.value === BRUNCH) {
            setMealType(BRUNCH)
        } else if (event.target.value === LUNCH) {
            setMealType(LUNCH)
        } else if (event.target.value === LATE_LUNCH) {
            setMealType(LATE_LUNCH)
        } else if (event.target.value === DINNER) {
            setMealType(DINNER);
        }
    };

    /* parses recommended items from backend based on recommendation type and meal type when those fields change */
    useEffect(() => {
        if (recommendationType === BASED_ON_SAVED) {
            getRecommendationsBasedOnSavedItems(mealType);
            setCourtsMenu(recsSaved);
        } else if (recommendationType === BASED_ON_PREFS) {
            getRecommendationsBasedOnPrefsRests(mealType);
            setCourtsMenu(recsPrefsRests);
        }
    // eslint-disable-next-line
    }, [recommendationType, mealType]);

    /* set menu before sorting each time something updates */
    useEffect(() => {
        setMenuBeforeSortPop(JSON.parse(JSON.stringify(courtsMenu)));
    }, [courtsMenu])

    function listItem(item) { //display a menu item
        // display a menu item
        let name = item.name;
        if (name.length > 40) {
            name = name.substring(0, 40) + "...";
        }
        const id = item.ID;
        const rating = item.avgRating > 0 ? item.avgRating : "-";

        return (
            <Link to={`/foodInfo/${id}`} className="link">
                <ListItem component="div" disablePadding button={true}
                    sx={{
                        paddingLeft: '16px', // Add left padding
                        paddingRight: '16px', // Add right padding for symmetry
                        borderBottom: '1px solid #e0e0e0', // Line between items
                        marginBottom: '8px', // Spacing between items
                        paddingBottom: '8px', // Padding at the bottom of the item
                        display: 'flex', // Make this a flex container
                        justifyContent: 'space-between', // Space between items
                        alignItems: 'center', // Align items vertically in the center
                    }}>
                    <span className="listItem">{name}</span>
                    <span className="listRating">{rating}</span> {/* Added marginRight */}
                </ListItem>
            </Link>
        );
    }

    /* when user clicks on sorting button */
    const handleSortClickPop = () => {
        setShouldSortPop(!shouldSortPop);
    }

    /* Sort by rating(popular items) */
    useEffect(() => {
        // sort courts menu then set it to the sorted
        if (shouldSortPop) {
            setMenuBeforeSortPop(JSON.parse(JSON.stringify(courtsMenu)));
            courtsMenu.sort((a, b) => (a.avgRating < b.avgRating) ? 1 : ((b.avgRating < a.avgRating) ? -1 : 0)); //make the most highly rated items appear at the top of the list
        } else if (!shouldSortPop) {
            setCourtsMenu(menuBeforeSortPop);
        }
        // eslint-disable-next-line
    }, [shouldSortPop]);

    // console.log(courtsMenu);

    return (
        <div className="recommendedMenuItems">
            <Navbar />
            <div>
                <div className="sectionHeader">
                    <h4 className="menuTitle">{`Recommended menu items`}</h4>
                    <div className="ratingHeader">
                        <span className="ratingTitle">Rating</span>
                        <span className="ratingSubtitle">out of 5</span>
                    </div>
                </div>
                {/* <h6>(click to view info)</h6> */}
                <Box sx={{ height: 400, width: 380, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                    <Paper style={{ height: 400, overflow: 'auto' }}>
                        {/* {console.log(noItems.current)} */}
                        {
                            (
                                loading.current ? (
                                    <List>
                                        <ListItem component="div" disablePadding button={true}>
                                            <span className="header">{"Loading..."}</span>
                                        </ListItem>
                                    </List>
                                ) : (
                                    courtsMenu.length !== 0 ? (
                                        <List>
                                            {courtsMenu.map((item) => listItem(item))}
                                        </List>
                                    ) : (
                                        noItems.current ? (
                                            <List>
                                                <ListItem component="div" disablePadding button={true}>
                                                    <span className="header">{"No items recommended at this time."}</span>
                                                </ListItem>
                                            </List>
                                        ) : (
                                            recommendationType === BASED_ON_PREFS ? (
                                                <List>
                                                    <ListItem component="div" disablePadding button={true}>
                                                        <span className="header">{"Select some preferences/restrictions first."}</span>
                                                    </ListItem>
                                                </List>
                                            ) : (
                                                <List>
                                                    <ListItem component="div" disablePadding button={true}>
                                                        <span className="header">{"Save more menu items first."}</span>
                                                    </ListItem>
                                                </List>
                                            )
                                        )
                                    )
                                )
                            )
                        }
                    </Paper>
                </Box>
            </div>
            <Stack className="stack" spacing={2} ml={"50px"}>
                <div className="filter">
                    {/* <h4>Select Your Filters!</h4> */}
                    {/* <h6>(click to open options)</h6> */}
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}  >
                            <InputLabel>Filters</InputLabel>
                            <Select id="demo-simple-select" value={recommendationType} label="Filter" onChange={handleRecTypeChange}
                                classes={{ root: classes.root, select: classes.selected }}
                            >
                                <MenuItem value={BASED_ON_PREFS}>Recommend Based On My Preferences/Restrictions</MenuItem>
                                <MenuItem value={BASED_ON_SAVED}>Recommend Based On Saved Items</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {/* <div>
                        {
                            message !== "All Good!" && (
                                <>
                                    <h4>{`${message}`}</h4>
                                </>
                            )
                        }
                    </div> */}
                </div>
                <div className="filter2">
                    {/* <h4>Select Meals:</h4><h6>(click to view options)</h6> */}
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}  >
                            <InputLabel>Meal Type</InputLabel>
                            <Select id="demo-simple-select" value={mealType} label="Filter" onChange={handleMealChange}
                                classes={{ root: classes.root, select: classes.selected }}
                            >
                                <MenuItem value={ALL_MEALS}>{`All meal types`}</MenuItem>
                                <MenuItem value={BREAKFAST}>{`Breakfast`}</MenuItem>
                                <MenuItem value={BRUNCH}>{`Brunch`}</MenuItem>
                                <MenuItem value={LUNCH}>{`Lunch`}</MenuItem>
                                <MenuItem value={LATE_LUNCH}>{`Late Lunch`}</MenuItem>
                                <MenuItem value={DINNER}>{`Dinner`}</MenuItem>
                            </Select>
                        </FormControl>
                        <FormGroup className="checkbox">
                            <FormControlLabel 
                                control={
                                    <Checkbox
                                        size="small"
                                        color="secondary"
                                        sx={{
                                            color: 'white', // This sets the color of the checkbox
                                            '&.Mui-checked': {
                                                color: 'white', // This sets the color when the checkbox is checked
                                            },
                                            '& .MuiSvgIcon-root': { // This targets the SVG icon (the box itself)
                                                color: 'white', // Color for the unchecked state
                                            },
                                        }}
                                    />
                                }
                                label={"Sort by Item Popularity"} 
                                checked={shouldSortPop} 
                                onChange={handleSortClickPop} />
                        </FormGroup>
                    </Box>
                </div>
            </Stack>


            {/* <Footer /> */}
        </div>
    );

};

export default RecommendedMenuItems;
