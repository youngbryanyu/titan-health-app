// Javascript for page displaying menu items for a dining court
import Navbar from "../../components/navbar/navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import "./popular.scss";
import axios from "axios";
import { useRef } from "react";
import {
	Box,
	List,
	ListItem,
	Paper,
} from "@mui/material";

const PopularMenuItems = () => {
    const loading = useRef(true); /* whether page is loading */
    const [popularItems, setpopularItems] = useState([]); // the current items displayed in list
    const [existsPopularItems, setExistsPopularItems] = useState(true); // whether any items exist above the popular threshold
    /**
    * Load dining courts items on page load and alters anytime the location changes (when user first enters the page)
    */
    useEffect(() => {
        const getCourtsItems = async () => {
            try {
                const response = await axios.get(`/menuInfo/popular`);
                if (response.data.length === 0) {
                    setExistsPopularItems(false);
                }
                const courtsItems = response.data;
                loading.current = false; /* done loading */
                setpopularItems(courtsItems);
            } catch (error) { 
                loading.current = false; /* done loading */
                setpopularItems([]);
                console.log(error) 
            };
        };

        setpopularItems([]); // this is to set the menu to blank (to clear the prior stuff while loading)
        getCourtsItems();

        // eslint-disable-next-line
    }, [location]);

    /* return the proper number of stars for a menu item */

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

    return (
        <div className="popular">
            <Navbar />
            <div className="items">
                <div className="sectionHeader">
                    <h4 className="menuTitle">{`Popular menu items today`}</h4>
                    <div className="ratingHeader">
                        <span className="ratingTitle">Rating</span>
                        <span className="ratingSubtitle">out of 5</span>
                    </div>
                </div>
                {/* <h6>(click to view info)</h6> */}
                <Box sx={{ width: 380, height: 400, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                    <Paper style={{ height: 400, overflow: 'auto' }}>
                        <List>
                            {
                                loading.current ? (
                                    <List>
                                        <ListItem component="div" disablePadding button={true}>
                                            <span className="header">{"Loading..."}</span>
                                        </ListItem>
                                    </List>
                                ) : (
                                    existsPopularItems ? (
                                        popularItems.map((item) => listItem(item))
                                    ) : (
                                        <ListItem component="div" button={true}>
                                            <span>No popular items today</span>
                                        </ListItem>
                                    )
                                )
                            }
                        </List>
                    </Paper>
                </Box>
            </div>
        </div>

    );
};


export default PopularMenuItems;