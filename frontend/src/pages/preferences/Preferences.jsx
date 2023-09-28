// JS for settings page
import Navbar from "../../components/navbar/Navbar";
import "./preferences.scss";
// import Footer from "../../components/footer/Footer";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
import { Box, Checkbox, FormControlLabel, FormGroup, Grid } from "@material-ui/core";

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

const Preferences = () => {
    const { user } = useContext(AuthContext); // get user from auth context, can directly index into its fields
    let username = user.username;

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

    const [prefs, setPrefs] = useState([]); // preferences
    const [rests, setRests] = useState([]); // restrictions

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

    /**
     * Load initial preferences and restrictions on page render
     */
    const isFirstRender = useRef(true); // don't do anything on first render
    useEffect(() => {
        // Get initial preferences then set local variables to those.
        const setInitialPreferences = async () => {
            try {
                const response = await axios.get('users/preferences/' + username);
                const initialPreferences = response.data;
                const preferences = []; // initial preferences to set
                console.log("initial: " + preferences)
                if (initialPreferences.includes(VEGAN)) {
                    setVegan(true);
                    preferences.push(VEGAN);
                }
                if (initialPreferences.includes(VEGETARIAN)) {
                    setVegetarian(true);
                    preferences.push(VEGETARIAN);
                }

                setPrefs(preferences); // set preferences
                console.log("prefs init to: " + prefs)
            } catch (error) {
                console.log(error);
            }
        };

        // Get initial restrictions then set local variables to those.
        const setInitialRestrictions = async () => {
            try {
                const response = await axios.get('users/restrictions/' + username);
                const initialRestrictions = response.data;
                const restrictions = []; // restrictions to set initially
                if (initialRestrictions.includes(COCONUT)) {
                    setCoconut(true);
                    restrictions.push(COCONUT);
                }
                if (initialRestrictions.includes(EGGS)) {
                    setEggs(true);
                    restrictions.push(EGGS);
                }
                if (initialRestrictions.includes(FISH)) {
                    setFish(true);
                    restrictions.push(FISH);
                }
                if (initialRestrictions.includes(GLUTEN)) {
                    setGluten(true);
                    restrictions.push(GLUTEN);
                }
                if (initialRestrictions.includes(SESAME)) {
                    setSesame(true);
                    restrictions.push(SESAME);
                }
                if (initialRestrictions.includes(SHELLFISH)) {
                    setShellfish(true);
                    restrictions.push(SHELLFISH);
                }
                if (initialRestrictions.includes(SOY)) {
                    setSoy(true);
                    restrictions.push(SOY);
                }
                if (initialRestrictions.includes(TREE_NUTS)) {
                    setTreeNuts(true);
                    restrictions.push(TREE_NUTS);
                }
                if (initialRestrictions.includes(WHEAT)) {
                    setWheat(true);
                    restrictions.push(WHEAT);
                }
                if (initialRestrictions.includes(MILK)) {
                    setMilk(true);
                    restrictions.push(MILK);
                }
                if (initialRestrictions.includes(PEANUTS)) {
                    setPeanuts(true);
                    restrictions.push(PEANUTS);
                }

                setRests(restrictions); // set restrictions
            } catch (error) {
                console.log(error);
            }
        };
        if (isFirstRender.current) {
            setInitialPreferences();
            setInitialRestrictions();
        }
        isFirstRender.current = false;
        // eslint-disable-next-line
    }, []);

    /**
     * Update preferences when any of the preferences changes. This will trigger the useEffect below.
     */
    const isFirstRender_update = useRef(true); // don't do anything on first render
    useEffect(() => {
        if (isFirstRender_update.current) {
            isFirstRender_update.current = false;
            return; // don't update DB on initial render
        }

        const preferences = []; // set preferences
        if (vegetarian) preferences.push(VEGETARIAN);
        if (vegan) preferences.push(VEGAN);

        setPrefs(preferences); // triggers useEffect below
    }, [vegan, vegetarian]);

    /**
     * Update the preferences in the database when prefs changes, not on first render though. Triggered by useEffect above
     */
    const isFirstRender_updatePrefsDB = useRef(true); // don't do anything on first render
    useEffect(() => {
        if (isFirstRender_updatePrefsDB.current) {
            isFirstRender_updatePrefsDB.current = false;
            console.log("skipping prefs update cuz first load");
            return; // don't update DB on initial render
        }

        const updatePreferencesInDB = async () => {
            try {
                console.log("setting prefs to:" + prefs);
                await axios.post('users/preferences', {
                    username: username,
                    preferences: prefs
                });
                console.log("successfully updated preferences");
            } catch (error) {
                console.log("failed to update preferences: " + error);
            }
        }
        updatePreferencesInDB(); // update the preferences in the database
        // eslint-disable-next-line
    }, [prefs]);

    /**
     * Update restrictions when any of the restrictions changes. This will trigger the useEffect below.
     */
    const isFirstRender_updateRestrictions = useRef(true); // don't do anything on first render
    useEffect(() => {
        if (isFirstRender_updateRestrictions.current) {
            isFirstRender_updateRestrictions.current = false;
            return; // don't update DB on initial render
        }

        const restrictions = []; // set restrictions
        if (coconut) restrictions.push(COCONUT);
        if (eggs) restrictions.push(EGGS);
        if (fish) restrictions.push(FISH);
        if (gluten) restrictions.push(GLUTEN);
        if (sesame) restrictions.push(SESAME);
        if (shellfish) restrictions.push(SHELLFISH);
        if (soy) restrictions.push(SOY);
        if (treeNuts) restrictions.push(TREE_NUTS);
        if (wheat) restrictions.push(WHEAT);
        if (milk) restrictions.push(MILK);
        if (peanuts) restrictions.push(PEANUTS);

        setRests(restrictions); // triggers useEffect below
    }, [coconut, eggs, fish, gluten, sesame, shellfish, soy, treeNuts, wheat, milk, peanuts]);

    /**
     * Update the restrictions in the database when restrictions changes, not on first render though. Triggered by useEffect above
     */
    const isFirstRender_updateRestsDB = useRef(true); // don't do anything on first render
    useEffect(() => {
        if (isFirstRender_updateRestsDB.current) {
            isFirstRender_updateRestsDB.current = false;
            return; // don't update DB on initial render
        }

        const updateRestrictionsInDB = async () => {
            try {
                await axios.post('users/restrictions', {
                    username: username,
                    restrictions: rests
                });
                console.log("successfully updated restrictions: " + rests);
            } catch (error) {
                console.log("failed to update restrictions: " + error);
            }
        }

        updateRestrictionsInDB(); // update the restrictions in the database
        // eslint-disable-next-line
    }, [rests]);


    return (
        <div className="preferences">
            <Navbar />
            <Grid container rowSpacing={10} columnSpacing={{ xs: 10, sm: 2, md: 3 }}>
                <Grid item xs={2}>
                    <div className="about">
                        <Box className="box"><span className="pageTitle">Dietary Preferences</span></Box>
                        <Box className="box"><span className="pageDesc">{"Select Your Dietary Preferences & Restrictions!"}</span></Box>
                    </div>
                </Grid>

                <Grid item xs={3}>
                    <div className="info2">
                        <Box className="box"><span className="header">Preferences</span></Box>
                        <FormGroup>

                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={VEGETARIAN} checked={vegetarian} onChange={handleVegetarian} />
                            </span></Box>
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={VEGAN} checked={vegan} onChange={handleVegan} />
                            </span></Box>
                        </FormGroup>
                    </div>
                </Grid>

                <Grid item xs={1}>
                    <div className="info3-1">
                        <Box className="box"><span className="header">Restrictions</span></Box>
                        <FormGroup  >

                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={COCONUT + " free"} checked={coconut} onChange={handleCoconut} />
                            </span></Box>
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={EGGS + " free"} checked={eggs} onChange={handleEggs} />
                            </span></Box>
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={FISH + " free"} checked={fish} onChange={handleFish} />
                            </span></Box>
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={GLUTEN + " free"} checked={gluten} onChange={handleGluten} />
                            </span></Box>
                        </FormGroup>
                    </div>
                </Grid>

                <Grid item xs={1}>
                    <div className="info4">
                        <FormGroup  >
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={SESAME + " free"} checked={sesame} onChange={handleSesame} />
                            </span></Box>
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={SHELLFISH + " free"} checked={shellfish} onChange={handleShellfish} />
                            </span></Box>
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={SOY + " free"} checked={soy} onChange={handleSoy} />
                            </span></Box>
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={TREE_NUTS + " free"} checked={treeNuts} onChange={handleTreeNuts} />
                            </span></Box>
                        </FormGroup>
                    </div>
                </Grid>

                <Grid item xs={1} className="info5">
                    <div className="pr-5">
                        <FormGroup  >
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={WHEAT + " free"} checked={wheat} onChange={handleWheat} />
                            </span></Box>
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={MILK + " free"} checked={milk} onChange={handleMilk} />
                            </span></Box>
                            <Box className="box"><span className="boxHeader2">
                                <FormControlLabel control={<Checkbox />} label={PEANUTS + " free"} checked={peanuts} onChange={handlePeanuts} />
                            </span></Box>
                        </FormGroup>
                    </div>
                </Grid>

            </Grid>
            {/* <Footer /> */}
        </div>
    );
};

export default Preferences;