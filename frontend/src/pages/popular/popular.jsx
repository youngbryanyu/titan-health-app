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
    StarIcon,
    StarOutlineIcon,
    StarHalf
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
        const name = item.name;
        const id = item.ID
        const avgRating = item.avgRating;
        return (
            <Link to={`/foodInfo/${id}`} className="link">
                <ListItem component="div" button={true}>
                    {/* <span className="stars">{getStars(avgRating)}</span> */}
                    <span>{`\t - ${name}`} </span>
                </ListItem>
            </Link>
        );
    }

    return (
        <div className="menu">
            <Navbar />
            <div>
                <h4 className="moreSpace">{`Popular menu items today:`}</h4>
                {/* <h6>(click to view info)</h6> */}
                <Box sx={{ width: '100%', height: 400, maxWidth: 1000, bgcolor: 'background.paper' }} className="list">
                    <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
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