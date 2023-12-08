// Javascript for page displaying a user's favorite menu items
import Navbar from "../../components/navbar/navbar";
import { Link } from "react-router-dom";
import "./savedMenuItems.scss";
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
import {
	Box,
	List,
	ListItem,
	Paper,
	FormGroup,
    FormControlLabel,
    Checkbox
} from "@mui/material";

const SavedMenuItems = () => {

    const [courtsMenu, setCourtsMenu] = useState([]); //the current items displayed in list
    const [menuBeforeSort, setMenuBeforeSort] = useState([]); // items displayed before sorting (courtsmenu)
    const [shouldSort, setShouldSort] = useState(false);
    const { user } = useContext(AuthContext);
    const userId = user._id;

    const loading = useRef(true); /* whether items are loading */

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

    /* sorting */
    const handleSortClick = () => {
        setShouldSort(!shouldSort);
    }

    /**
    * Load dining courts items on page load and alters anytime the location changes
    */
    useEffect(() => {
        const getSavedItems = async () => {
            try {
                const response = await axios.get(`/saved/allSaved/${userId}`);
                const courtsItems = response.data;
                loading.current = false /* not loading anymore after items are loaded */
                setCourtsMenu(courtsItems);
            } catch (error) { 
                loading.current = false /* not loading anymore after items are loaded */
                setCourtsMenu([]);
                console.log(error);
            };
        };

        if (userId != null) {
            getSavedItems();
        }

        // eslint-disable-next-line
    }, []);

    //console.log(courtsMenu.length);

    /* Sorting useEffect */
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current === true) {
            isFirstRender.current = false;
            return;
        }
        // sort courts menu then set it to the sorted
        if (shouldSort) {
            //this does a copy of the prior menu
            setMenuBeforeSort(JSON.parse(JSON.stringify(courtsMenu))); //unsorted items now stored in menuBeforeSort
            //now we sort the item (this is an inline function that compares two objects names)
            //this means (if a's name > b's name) then return 1
            //            else return (if b's name > a's name) then 1 
            //                         else return 0 which means both names are equal
            courtsMenu.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        } else if (!shouldSort) {
            //set courtsMenu back to the way it was originally
            setCourtsMenu(menuBeforeSort);
        }
        // eslint-disable-next-line
    }, [shouldSort]);

    return (
        <div className="savedMenuItems">
            <Navbar />
            <div className="items">
                <div className="sectionHeader">
                    <h4 className="menuTitle">{`Your saved menu items`}</h4>
                    <div className="ratingHeader">
                        <span className="ratingTitle">Rating</span>
                        <span className="ratingSubtitle">out of 5</span>
                    </div>
                </div>
                {/* <h6>(click an item to see its info)</h6> */}
                <Box sx={{ height: 400, width: 380, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                    <Paper style={{ height: 400, overflow: 'auto' }}>
                        {
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
                                    <List>
                                        <ListItem component="div" disablePadding button={true}>
                                            <span className="header">{"No favorite items."}</span>
                                        </ListItem>
                                    </List>
                                )
                            )
                        }

                    </Paper>
                </Box>
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
                        label={"Sort Alphabetically"} 
                        checked={shouldSort} 
                        onChange={handleSortClick} />
                </FormGroup>
            </div>
        </div>
    );
};

export default SavedMenuItems;