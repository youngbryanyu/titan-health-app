// Javascript for page displaying menu items for a dining court
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    List,
    ListItem,
    TextField,
    Autocomplete,
    Paper,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Stack
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { Mail, Phone, NearMe } from "@mui/icons-material";
import Navbar from "../../components/navbar/navbar";
import { AuthContext } from "../../utils/authentication/auth-context";
import "./menu.scss";

const useStyles = makeStyles((theme) => ({
    root: {
        color: "black",
    },
    selected: {
        color: "white",
    },
}));



const Menu = () => {
    const classes = useStyles();
    let { location } = useParams();
    const { user } = useContext(AuthContext);

    /* filter constants */
    const FULL_MENU = 0;
    const CUSTOM_PREFS = 1;
    const MY_PREFS = 2;

    /* fields for meal type */
    const ALL_MEALS = 0;
    const BREAKFAST = 1;
    const BRUNCH = 2;
    const LUNCH = 3;
    const LATE_LUNCH = 4
    const DINNER = 5
    const [mealType, setMealType] = useState(ALL_MEALS);
    const mealTypes = ["", "Breakfast", "Unknown", "Lunch", "Snack", "Dinner"];

    // const [meal, setMeal] = useState("");
    //keep track of all menu items
    const [allItems, setAllItems] = useState([]);
    //keep track of the selected checkbox items
    const [selectedItems, setSelectedItems] = useState([]);
    // the current items displayed in list
    const [courtsMenu, setCourtsMenu] = useState([]);
    //the current times in the list
    const [times, setTimes] = useState([]);
    //keep track of matching user's prefs items
    const [matchingItems, setMatchingItems] = useState([]);
    //keep track of which filterconst [] option is currently chosen
    const [view, setView] = useState(FULL_MENU);

    const [shouldSort, setShouldSort] = useState(false);
    // items displayed before sorting (courtsmenu)
    const [menuBeforeSort, setMenuBeforeSort] = useState([]);
    //should sort based off item popularity
    const [shouldSortPop, setShouldSortPop] = useState(false);
    // sort the menu items based on the rating
    const [menuBeforeSortPop, setMenuBeforeSortPop] = useState([]);
    //disabling the button when the other one is in use
    const [disableSort, setDisableSort] = useState(false);
    //disabling the button when the other one is in use
    const [disableSortPop, setDisableSortPop] = useState(false);

    //should sort based on protein
    const [shouldSortProtein, setShouldSortProtein] = useState(false);

    // sort the menu items based on the protein
    const [menuBeforeSortProtein, setMenuBeforeSortProtein] = useState([]);

    //disabling the button when the other one is in use
    const [disableSortProtein, setDisableSortProtein] = useState(false);


    //should sort based on fat
    const [shouldSortFat, setShouldSortFat] = useState(false);

    // sort the menu items based on the fat
    const [menuBeforeSortFat, setMenuBeforeSortFat] = useState([]);

    //disabling the button when the other one is in use
    const [disableSortFat, setDisableSortFat] = useState(false);

    //should sort based on calories
    const [shouldSortCalories, setShouldSortCalories] = useState(false);

    // sort the menu items based on the calories
    const [menuBeforeSortCalories, setMenuBeforeSortCalories] = useState([]);

    //disabling the button when the other one is in use
    const [disableSortCalories, setDisableSortCalories] = useState(false);


    let username = user.username;

    const loading = useRef(true); /* whether page is loading */

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

    const [vegetarian, setVegetarian] = useState(false); // preferences
    const [vegan, setVegan] = useState(false);

    const [coconut, setCoconut] = useState(false); // restrictions
    const [eggs, setEggs] = useState(false);
    const [fish, setFish] = useState(false);
    const [gluten, setGluten] = useState(false);
    const [sesame, setSesame] = useState(false);
    const [shellfish, setShellfish] = useState(false);
    const [soy, setSoy] = useState(false);
    const [treeNuts, setTreeNuts] = useState(false);
    const [wheat, setWheat] = useState(false);
    const [milk, setMilk] = useState(false);
    const [peanuts, setPeanuts] = useState(false);

    let prefs = [];
    let rests = [];

    // handlers for toggling checkboxes
    const handleVegetarian = () => setVegetarian(!vegetarian);
    const handleVegan = () => setVegan(!vegan);
    const handleCoconut = () => setCoconut(!coconut);
    const handleEggs = () => setEggs(!eggs);
    const handleFish = () => setFish(!fish);
    const handleGluten = () => setGluten(!gluten);
    const handleSesame = () => setSesame(!sesame);
    const handleShellfish = () => setShellfish(!shellfish);
    const handleSoy = () => setSoy(!soy);
    const handleTreeNuts = () => setTreeNuts(!treeNuts);
    const handleWheat = () => setWheat(!wheat);
    const handleMilk = () => setMilk(!milk);
    const handlePeanuts = () => setPeanuts(!peanuts);

    // states for number, email, and loc
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");
    const [loc, setLoc] = useState("");

    // dining court names
    const WINDSOR = "Windsor";
    const WILEY = "Wiley";
    const FORD = "Ford";
    const EARHART = "Earhart";
    const HILLENBRAND = "Hillenbrand";

    // addresses of each dining court
    const WINDSOR_ADDR =
        "https://www.google.com/maps/place/Windsor+Dining+Court/@40.4270199,-86.9227636,17z/data=!3m1!4b1!4m5!3m4!1s0x8812e2b5c166c8cb:0xc6b89b5c96b567c4!8m2!3d40.4270158!4d-86.9205696";
    const WILEY_ADDR =
        "https://www.google.com/maps/place/Wiley+Dining+Court,+500+S+Martin+Jischke+Dr,+West+Lafayette,+IN+47906/@40.4270199,-86.9227636,17z/data=!4m5!3m4!1s0x8812e2b5a74ea24f:0x73a56c71f42b5191!8m2!3d40.4285229!4d-86.9207974";
    const FORD_ADDR =
        "https://www.google.com/maps/place/Ford+Dining+Court/@40.432113,-86.9217514,17z/data=!3m1!4b1!4m5!3m4!1s0x8812fd4b26db4177:0x2f3f9ae6b45d3924!8m2!3d40.4321076!4d-86.9193754";
    const EARHART_ADDR =
        "https://www.google.com/maps/place/Earhart+Dining+Court/@40.432113,-86.9217514,17z/data=!4m5!3m4!1s0x8812fddb980c7891:0xbe31985e92758c5a!8m2!3d40.4256049!4d-86.9251085";
    const HILLENBRAND_ADDR =
        "https://www.google.com/maps/place/Hillenbrand+Dining+Court/@40.4265725,-86.9290621,17z/data=!3m1!4b1!4m5!3m4!1s0x8812e2cbef5b238b:0xf6c8203c74b1aa90!8m2!3d40.4270003!4d-86.9266448";

    /* handle clicking on address of dining court --> redirect to external link*/
    const handleClickLocation = () => {
        if (location === WINDSOR) {
            window.open(WINDSOR_ADDR, "_blank");
        }
        if (location === WILEY) {
            window.open(WILEY_ADDR, "_blank");
        }
        if (location === FORD) {
            window.open(FORD_ADDR, "_blank");
        }
        if (location === EARHART) {
            window.open(EARHART_ADDR, "_blank");
        }
        if (location === HILLENBRAND) {
            window.open(HILLENBRAND_ADDR, "_blank");
        }
    };

    /* set correct dining court info when location changes */
    useEffect(() => {
        if (location === WINDSOR) {
            setNumber("(765) 496-3905");
            setEmail("kbinge@purdue.edu");
            setLoc("205 North Russell Street West Lafayette, IN 47906");
        }
        if (location === WILEY) {
            setNumber("(765) 494-2264");
            setEmail("cavanare@purdue.edu");
            setLoc("498 S Martin Jischke Drive West Lafayette, IN 47906");
        }
        if (location === FORD) {
            setNumber("(765) 494-2482");
            setEmail("ahallmen@purdue.edu");
            setLoc("1122 West Stadium Avenue West Lafayette, IN 47906");
        }
        if (location === EARHART) {
            setNumber("(765) 496-6925");
            setEmail("coryb@purdue.edu");
            setLoc("1275 1st Street West Lafayette, IN 47906");
        }
        if (location === HILLENBRAND) {
            setNumber("(765) 496-0461");
            setEmail("nmputubw@purdue.edu");
            setLoc("1301 3rd Street West Lafayette, IN 47906");
        }
    }, [location]);

    /* sorting */
    const handleSortClick = () => {
        setShouldSort(!shouldSort);
    };

    const handleSortClickPop = () => {
        setShouldSortPop(!shouldSortPop);
    };

    const handleSortClickProtein = () => {
        setShouldSortProtein(!shouldSortProtein);
    };

    const handleSortClickFat = () => {
        setShouldSortFat(!shouldSortFat);
    };

    const handleSortClickCalories = () => {
        setShouldSortCalories(!shouldSortCalories);
    };


    /*disable the sorting button*/
    // const handleSortDisable = () => {
    //     setDisableSort(!disableSort);
    // };

    // const handleSortDisablePop = () => {
    //     setDisableSortPop(!disableSortPop);
    // };

    /* Sorting useEffect */
    useEffect(() => {
        // sort courts menu then set it to the sorted
        if (shouldSort) {
            setDisableSortPop(true);
            setDisableSortProtein(true);
            setDisableSortFat(true);
            setDisableSortCalories(true);
            //this does a copy of the prior menu
            setMenuBeforeSort(JSON.parse(JSON.stringify(courtsMenu))); //unsorted items now stored in menuBeforeSort
            //now we sort the item (this is an inline function that compares two objects names)
            //this means (if a's name > b's name) then return 1
            //            else return (if b's name > a's name) then 1
            //                         else return 0 which means both names are equal
            courtsMenu.sort((a, b) =>
                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
            );
        } else if (!shouldSort) {
            setDisableSortPop(false);
            setDisableSortProtein(false);
            setDisableSortFat(false);
            setDisableSortCalories(false);
            //set courtsMenu back to the way it was originally
            setCourtsMenu(menuBeforeSort);
        }
        // eslint-disable-next-line
    }, [shouldSort]);

    /*Sort by rating(popular items) */
    useEffect(() => {
        // sort courts menu then set it to the sorted
        if (shouldSortPop) {
            setDisableSort(true);
            setDisableSortProtein(true);
            setDisableSortFat(true);
            setDisableSortCalories(true);
            setMenuBeforeSortPop(JSON.parse(JSON.stringify(courtsMenu)));
            courtsMenu.sort((a, b) =>
                a.avgRating < b.avgRating ? 1 : b.avgRating < a.avgRating ? -1 : 0
            ); //make the most highly rated items appear at the top of the list
        } else if (!shouldSortPop) {
            setDisableSort(false);
            setDisableSortProtein(false);
            setDisableSortFat(false);
            setDisableSortCalories(false);
            setCourtsMenu(menuBeforeSortPop);
        }
        // eslint-disable-next-line
    }, [shouldSortPop]);

    /*Sort by highest protein count */
    useEffect(() => {
        if (shouldSortProtein) {
            setDisableSort(true);
            setDisableSortPop(true);
            setDisableSortFat(true);
            setDisableSortCalories(true);
            setMenuBeforeSortProtein([...courtsMenu]);
            courtsMenu.sort((a, b) => (b?.nutritionFacts?.[11]?.Value || 0) - (a?.nutritionFacts?.[11]?.Value || 0));
            setCourtsMenu(courtsMenu);
        } else if (!shouldSortProtein) {
            setDisableSort(false);
            setDisableSortPop(false);
            setDisableSortFat(false);
            setDisableSortCalories(false);
            setCourtsMenu([...menuBeforeSortProtein]);
        }
        // eslint-disable-next-line
    }, [shouldSortProtein]);


    /*Sort by lowest fat count */
    useEffect(() => {
        if (shouldSortFat) {
            setDisableSort(true);
            setDisableSortPop(true);
            setDisableSortProtein(true);
            setDisableSortCalories(true);
            setMenuBeforeSortFat([...courtsMenu]);
            courtsMenu.sort((a, b) => (a?.nutritionFacts?.[3]?.Value || 0) - (b?.nutritionFacts?.[3]?.Value || 0));
            setCourtsMenu(courtsMenu);
        } else if (!shouldSortFat) {
            setDisableSort(false);
            setDisableSortPop(false);
            setDisableSortProtein(false);
            setDisableSortCalories(false);
            setCourtsMenu([...menuBeforeSortFat]);
        }
        // eslint-disable-next-line
    }, [shouldSortFat]);


      /*Sort by lowest calorie count */
      useEffect(() => {
        if (shouldSortCalories) {
            setDisableSort(true);
            setDisableSortPop(true);
            setDisableSortProtein(true);
            setDisableSortFat(true);
            setMenuBeforeSortCalories([...courtsMenu]);
            courtsMenu.sort((a, b) => (a?.nutritionFacts?.[1]?.Value || 0) - (b?.nutritionFacts?.[1]?.Value || 0));
            setCourtsMenu(courtsMenu);
        } else if (!shouldSortCalories) {
            setDisableSort(false);
            setDisableSortPop(false);
            setDisableSortProtein(false);
            setDisableSortFat(false);
            setCourtsMenu([...menuBeforeSortCalories]);
        }
        // eslint-disable-next-line
    }, [shouldSortCalories]);

    /* selecting preferences and restrictions from checkbox */
    const handleSelectPrefsClick = async () => {
        //this is for handling the submit button of preferences
        prefs = [];
        rests = [];

        if (vegetarian) prefs.push(VEGETARIAN);
        if (vegan) prefs.push(VEGAN);
        if (coconut) rests.push(COCONUT);
        if (eggs) rests.push(EGGS);
        if (fish) rests.push(FISH);
        if (gluten) rests.push(GLUTEN);
        if (sesame) rests.push(SESAME);
        if (shellfish) rests.push(SHELLFISH);
        if (soy) rests.push(SOY);
        if (treeNuts) rests.push(TREE_NUTS);
        if (wheat) rests.push(WHEAT);
        if (milk) rests.push(MILK);
        if (peanuts) rests.push(PEANUTS);

        const getItemsFromSelections = async () => {
            try {
                var response;
                if (mealType === ALL_MEALS) {
                    response = await axios.post(
                        `/menuInfo/prefsAndRests/${location}`,
                        {
                            preferences: prefs,
                            restrictions: rests,
                        }
                    );
                } else {
                    response = await axios.post(
                        `/menuInfo/prefsAndRests/${location}/${mealTypes[mealType]}`,
                        {
                            preferences: prefs,
                            restrictions: rests,
                        }
                    );
                }
                const courtsItems = response.data;
                loading.current = false; /* done loading */
                setSelectedItems(courtsItems);
                setCourtsMenu(courtsItems);
            } catch (error) {
                console.log(error);
            }
        };

        getItemsFromSelections();
    };

    /* returns whether no checkboxes are selected */
    function noCheckBoxesSelected() {
        return (!vegetarian && !vegan && !coconut && !eggs && !fish && !gluten && !sesame
            && !shellfish && !soy && !treeNuts && !wheat && !milk && !peanuts);
    }

    /* set menu before sorting each time something updates */
    useEffect(() => {
        setMenuBeforeSort(JSON.parse(JSON.stringify(courtsMenu)));
    }, [courtsMenu]);

    /* handles changing filters */
    const handleChange = (event) => {
        loading.current = true; /* need to load */
        setShouldSort(false); /* reset sorting when user changes filter */
        setShouldSortPop(false);
        setShouldSortProtein(false);
        setDisableSortFat(false);
        setDisableSortCalories(false);

        //this is for handling the filters options
        if (event.target.value === FULL_MENU) {
            //this means the user wants to view all items
            setView(FULL_MENU);
            setCourtsMenu(allItems);
        } else if (event.target.value === CUSTOM_PREFS) {
            //this means user wants to select from checkbox
            setView(CUSTOM_PREFS);
            setCourtsMenu(selectedItems);
        } else if (event.target.value === MY_PREFS) {
            //this means the user selected Items Matching My Prefs & Rests
            setView(MY_PREFS);
            setCourtsMenu(matchingItems);
        }
    };

    /* handle changing mealtype */
    const handleMeals = (event) => {
        loading.current = true; /* need to load */
        setShouldSort(false); /* reset sorting when user changes filter */
        setShouldSortPop(false);
        setShouldSortProtein(false);
        setDisableSortFat(false);
        setDisableSortCalories(false);

        //this is for handling the meal selection options
        if (event.target.value === ALL_MEALS) {
            setMealType(ALL_MEALS);
        } else if (event.target.value === BREAKFAST) {
            setMealType(BREAKFAST);
        } else if (event.target.value === BRUNCH) {
            setMealType(BRUNCH);
        } else if (event.target.value === LUNCH) {
            setMealType(LUNCH);
        } else if (event.target.value === LATE_LUNCH) {
            setMealType(LATE_LUNCH);
        } else if (event.target.value === 5) {
            setMealType(DINNER);
        }
    };

    /* useEffect for handling selecting filters */
    useEffect(() => {
        if (view === MY_PREFS) {
            getItemsMatchingUser();
        } else if (view === CUSTOM_PREFS) {
            // setCourtsMenu(["loading"]);
            setShouldSort(false); /* reset sorting */
            setShouldSortPop(false);
            setShouldSortProtein(false);
            setDisableSortFat(false);
            setDisableSortCalories(false);
            handleSelectPrefsClick();
        } else if (view === FULL_MENU) {
            getCourtsItems();
        }
        // eslint-disable-next-line
    }, [view, mealType]);

    /* edge case: useEffect for instantaneous custom prefs updates */
    useEffect(() => {
        if (view === CUSTOM_PREFS) {
            // setCourtsMenu(["loading"]);
            setShouldSort(false); /* reset sorting */
            setShouldSortPop(false);
            setShouldSortProtein(false);
            setDisableSortFat(false);
            setDisableSortCalories(false);
            handleSelectPrefsClick();
        }
    },
        // eslint-disable-next-line
        [vegetarian, vegan, coconut, eggs, fish, gluten, sesame, shellfish,
            soy, treeNuts, wheat, milk, peanuts]);

    const [busyLevel, setBusyLevel] = useState("");

    /* get all items from court */
    const getCourtsItems = async () => {
        try {
            var response;
            if (mealType === ALL_MEALS) {
                response = await axios.get(`/menuInfo/${location}`);
            } else {
                response = await axios.get(`/menuInfo/meals/${location}/${mealTypes[mealType]}`);
            }
            // console.log(response.data);
            const courtsItems = response.data;
            loading.current = false; /* done loading (must end load in between) */
            setCourtsMenu(courtsItems);
            setAllItems(courtsItems);
        } catch (error) {
            console.log(error);
        }
    };

    /* get items matching user preferences */
    const getItemsMatchingUser = async () => {
        try {
            var response;
            console.log("mealtype is " + mealTypes[mealType])
            if (mealType === ALL_MEALS) {
                response = await axios.get(
                    `/menuInfo/prefs/${location}/${username}`
                );
                console.log("getting prefs for all")
            } else {
                response = await axios.get(
                    `/menuInfo/prefs/${location}/${username}/${mealTypes[mealType]}`
                );
                console.log("getting prefs for " + mealTypes[mealType])
            }
            const courtsItems = response.data;
            loading.current = false; /* done loading (must end load in between) */
            setCourtsMenu(courtsItems);
            setMatchingItems(courtsItems);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Load dining courts items on page load and alters anytime the location changes (when user first enters the page)
     */
    useEffect(() => {
        const getTimes = async () => {
            try {
                const response = await axios.get(`/menuInfo/courts/${location}`);
                const courtInfo = response.data;
                setTimes(courtInfo.mealInfo);
            } catch (error) {
                console.log(error);
            }
        };

        const getBusy = async () => {
            try {
                const response = await axios.get(`/menuInfo/busy/${location}`);
                const busyness = response.data;
                setBusyLevel(busyness);
            } catch (error) {
                console.log(error);
            }
        };

        if (location !== null) {
            setMealType(ALL_MEALS); /* reset filters to default (this causes slight visual glitch) */
            setView(FULL_MENU);
            setShouldSort(false); /* reset sorting */
            setShouldSortPop(false);
            setShouldSortProtein(false);
            setDisableSortFat(false);
            setDisableSortCalories(false);

            loading.current = true; /* loading new page */
            setCourtsMenu(["loading"]); // this is to set the menu to blank (to clear the prior stuff while loading) -> causes slight visual glitch
            getCourtsItems();
            getTimes();
            getBusy();
        }
        // eslint-disable-next-line
    }, [location]);

    /* creates list for meal times */
    function listTimes(time) {
        const type = time.mealType;
        const start = time.start;
        const end = time.end;

        return (
            <ListItem
                component="div"
                disablePadding
                button={false}
                sx={{
                    paddingLeft: '16px', // Add left padding
                    borderBottom: '1px solid #e0e0e0', // Line between items
                    marginBottom: '8px', // Spacing between items
                    paddingBottom: '8px', // Padding at the bottom of the item
                }}
            >
                <span className="smallListItem">{`${type}: ${start} to ${end}`}</span>
            </ListItem>
        )
    }

    function listItem(item) {
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


    const navigate = useNavigate();
    //searchbar component. cannot search for just any value, have to select from dropdown
    //params: current menu state (pass in courtsMenu)
    function Searchbar(menu) {
        function handleInputChange(event, value) {
            if (!value) {
                return;
            }
            if (value.ID) {
                console.log(value.ID);
                navigate("/foodInfo/" + value.ID);
            }
        }
        return (
            <Box>
                <Autocomplete
                    disablePortal
                    autoComplete={true}
                    autoHighlight={true}
                    id="menu-search-bar"
                    options={menu}
                    getOptionLabel={(option) => option.name}
                    onChange={handleInputChange}
                    renderInput={(params) => (
                        <TextField {...params} label="Search for an item" />
                    )}
                    sx={{
                        pt: "5px",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "White",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "White",
                        },
                        "& .MuiOutlinedInput-input": {
                            color: "White",
                        },
                        "& .MuiInputLabel-outlined": {
                            color: "White",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "White",
                        },
                        "&.Mui-focused .MuiInputLabel-outlined": {
                            color: "White",
                        },
                    }}
                />
            </Box>
        );
    }

    // prototype for displaying a default message for if there is no response for a meal
    // function displayMenu(menu) {
    //     if(!menu) {
    //         return (
    //             <ListItem component="div" disablePadding button={true}>
    //                 <span className="header">{`${location}`} is not serving {`${meal}`}</span>
    //             </ListItem>
    //         )
    //     } else {
    //         menu.map((item) => listItem(item))
    //     }
    // }
    let date = new Date();
    let options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };

    var busytime = date.toLocaleTimeString("en-us", options);
    return (
        <div className="menu">
            <Navbar />
            <div className="menuTimes">
                <h4 className="howBusy">{`How busy is ${location}?`}</h4>
                <Box
                    sx={{
                        width: 250,
                        maxHeight: 80,
                        maxWidth: 360,
                        bgcolor: "background.paper",
                        borderRadius: 5
                    }}
                    className="list"
                >
                    <Paper style={{ height: 50, width: 250, overflow: "auto" }}>
                        <List>
                            <ListItem component="div" disablePadding button={false}
                                sx={{
                                    paddingLeft: '16px', // Add left padding
                                    borderBottom: '1px solid #e0e0e0', // Line between items
                                    marginBottom: '8px', // Spacing between items
                                    paddingBottom: '8px', // Padding at the bottom of the item
                                }}>
                                <span className="smallListItem">
                                    {`${location}`} is currently {`${busyLevel}`} at {`${busytime}`}
                                </span>
                            </ListItem>
                        </List>
                    </Paper>
                </Box>

                <h4 className="sectionTitle">{`When ${location} is open`}</h4>
                <Box
                    sx={{
                        width: 250,
                        maxHeight: 100,
                        bgcolor: "background.paper",
                        borderRadius: 5,
                    }}
                    className="list"
                >
                    <Paper style={{ maxHeight: 105, width: 250, overflow: "auto" }}>
                        <List>{times.map((time) => listTimes(time))}</List>
                    </Paper>
                </Box>
            </div>

            <div className="menuItems">
                <div className="sectionHeader">
                    <h4 className="pageTitle">{`${location}'s menu`}</h4>
                    <div className="ratingHeader">
                        <span className="ratingTitle">Rating</span>
                        <span className="ratingSubtitle">out of 5</span>
                    </div>
                </div>
                {/* <h6>(click to view info)</h6> */}
                <Box
                    sx={{
                        width: 380,
                        height: 400,
                        bgcolor: "background.paper",
                        borderRadius: 5
                    }}
                    className="list"
                >
                    <Paper style={{ height: 400, overflow: "auto" }}>
                        {
                            loading.current || courtsMenu[0] === "loading" ? (
                                <List>
                                    <ListItem component="div" disablePadding button={true}>
                                        <span style={{ marginLeft: 10 }} className="header">{"Loading..."}</span>
                                    </ListItem>
                                </List>
                            ) : (
                                view === CUSTOM_PREFS && noCheckBoxesSelected() ? (
                                    <List>
                                        <ListItem component="div" disablePadding button={true}>
                                            <span style={{ marginLeft: 10 }} className="header">{"Select some preferences/restrictions."}</span>
                                        </ListItem>
                                    </List>
                                ) : (
                                    courtsMenu.length !== 0 ? (
                                        <List>{courtsMenu.map((item) => listItem(item))}</List>
                                    ) : (
                                        <List>
                                            <ListItem component="div" disablePadding button={true}>
                                                <span style={{ marginLeft: 10 }} className="header">{"No items served at this time."}</span>
                                            </ListItem>
                                        </List>
                                    )
                                )
                            )
                        }
                    </Paper>
                </Box>
            </div>
            {/* using the MUI stack component to vertically stack the filtering options, then will stack search bar on top */}
            <Stack className="stack filters" spacing={2} ml={"50px"}>
                <div className="stackedFilter searchBar">
                    {/* <h4>Search for an item:</h4> */}
                    {Searchbar(courtsMenu)}
                </div>
                <div className="stackedFilter">
                    {/* <h4>Select filter: </h4> */}
                    {/* <h6>(click to view options)</h6> */}
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel>Filters</InputLabel>
                            <Select
                                id="demo-simple-select"
                                value={view}
                                label="Filter"
                                onChange={handleChange}
                                classes={{ root: classes.root, select: classes.selected }}
                            >
                                <MenuItem value={ALL_MEALS}>{`No filters`}</MenuItem>
                                <MenuItem value={CUSTOM_PREFS}>
                                    Custom Preferences & Restrictions
                                </MenuItem>
                                <MenuItem value={MY_PREFS}>
                                    My Preferences & Restrictions
                                </MenuItem>
                            </Select>
                        </FormControl>


                    </Box>
                </div>
                <div className="stackedFilter">
                    {/* <h4>Select Meals:</h4> */}
                    {/* <h6>(click to view options)</h6> */}
                    <Box sx={{ minWidth: 120, zIndex: 5 }}>
                        <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel>Meal type</InputLabel>
                            <Select
                                id="demo-simple-select"
                                value={mealType}
                                label="Filter"
                                onChange={handleMeals}
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

                        <FormGroup className="checkboxes">
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
                                label={"Sort Alphabetically"}
                                checked={shouldSort}
                                onChange={handleSortClick}
                                disabled={disableSort}
                            />
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
                                onChange={handleSortClickPop}
                                disabled={disableSortPop}
                            />
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
                                label={"Sort Item By High-Protein Content"}
                                checked={shouldSortProtein}
                                onChange={handleSortClickProtein}
                                disabled={disableSortProtein}
                            />
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
                                label={"Sort Item By Low-Fat Content"}
                                checked={shouldSortFat}
                                onChange={handleSortClickFat}
                                disabled={disableSortFat}
                            />
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
                                label={"Sort Item By Low-Calorie Content"}
                                checked={shouldSortCalories}
                                onChange={handleSortClickCalories}
                                disabled={disableSortCalories}
                            />
                        </FormGroup>
                    </Box>
                </div>
            </Stack>

            <div className="filter customPrefs">
                {view === CUSTOM_PREFS && (
                    <>
                        <h4 className="space">{`Select custom preferences and restrictions:`}</h4>
                        {/* <h6>(menu will update after submitting)</h6> */}
                        <FormGroup>
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
                                label={VEGETARIAN}
                                checked={vegetarian}
                                onChange={handleVegetarian}
                            />
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
                                label={VEGAN}
                                checked={vegan}
                                onChange={handleVegan}
                            />

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
                                label={COCONUT + " free"}
                                checked={coconut}
                                onChange={handleCoconut}
                            />
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
                                label={EGGS + " free"}
                                checked={eggs}
                                onChange={handleEggs}
                            />
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
                                label={FISH + " free"}
                                checked={fish}
                                onChange={handleFish}
                            />
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
                                label={GLUTEN + " free"}
                                checked={gluten}
                                onChange={handleGluten}
                            />
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
                                label={SESAME + " free"}
                                checked={sesame}
                                onChange={handleSesame}
                            />
                        </FormGroup>
                    </>
                )}
            </div>
            <div className="customPrefs">
                {view === CUSTOM_PREFS && (
                    <>
                        <FormGroup>
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
                                label={SHELLFISH + " free"}
                                checked={shellfish}
                                onChange={handleShellfish}
                            />
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
                                label={SOY + " free"}
                                checked={soy}
                                onChange={handleSoy}
                            />
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
                                label={TREE_NUTS + " free"}
                                checked={treeNuts}
                                onChange={handleTreeNuts}
                            />
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
                                label={WHEAT + " free"}
                                checked={wheat}
                                onChange={handleWheat}
                            />
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
                                label={MILK + " free"}
                                checked={milk}
                                onChange={handleMilk}
                            />
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
                                label={PEANUTS + " free"}
                                checked={peanuts}
                                onChange={handlePeanuts}
                            />
                        </FormGroup>
                        {/* <Button
                            onClick={handleSelectPrefsClick}
                            variant="contained"
                            endIcon={<ArrowUpwardIcon />}
                            className="moreSpace"
                        >
                            Submit
                        </Button> */}
                    </>
                )}
            </div>
            <span className="contactInfo">
                <span className="number">
                    {" "}
                    <Phone className="icon" /> {number}{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                </span>
                <span className="email">
                    {" "}
                    <Mail className="icon" /> {email}{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                </span>
                <span className="location" onClick={handleClickLocation}>
                    {" "}
                    <NearMe className="icon" /> {loc}{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                </span>
            </span>
        </div>
    );
};

export default Menu;
