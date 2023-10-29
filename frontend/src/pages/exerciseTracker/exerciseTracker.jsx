// Javascript for page displaying recommendations
import { Box, List, ListItem, Paper, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Navbar from "../../components/navbar/navbar";
import { Link } from "react-router-dom";
import { AuthContext } from "../../utils/authentication/auth-context";
import { useState, useEffect, useContext } from 'react';
import "./exerciseTracker.scss";
import axios from "axios";
import { useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        color: "black",
    },
    selected: {
        color: "white"
    }
}));

const ExerciseTracker = () => {

    const classes = useStyles();
    const { user } = useContext(AuthContext);
    const userId = user._id;

    /* Exercise info corresponding to input boxes */
    const [exerciseName, setExerciseName] = useState('');
    const [sets, setSets] = useState(0);
    const [reps, setReps] = useState(0);
    const [time, setTime] = useState(0);
    const [exerciseType, setExerciseType] = useState('');
    
    const [weightLiftingExercises, setLiftingExercises] = useState([]);
    const [cardioExercises, setCardioExercises] = useState([]);
    const [allExercises, setAllExercises] = useState([]);
    const [sortType, setSortType] = useState('all');
    
    /* Load exercises on page render */
    const isFirstRender = useRef(true); 
    useEffect(() => {
        // Get all exercises on load
        const getExercises = async () => {
            try {
                const resLifting = await axios.get(`/users/allLifting/${userId}`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });

                const resCardio = await axios.get(`/users/allCardio/${userId}`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });

                

                setLiftingExercises(resLifting.data);
                setCardioExercises(resCardio.data);
                setAllExercises(resLifting.data.concat(resCardio.data));

            } catch (error) {
                console.log(error);
            }
        };

        /* only run on first render */
        if (isFirstRender.current) {
            getExercises();
        }
        isFirstRender.current = false;
        // eslint-disable-next-line
    }, []);

    const handleAddExercise = async () => {

        try {
            const res = await axios.put(
                `users/addExercise/${userId}`,
                { exerciseName, sets, time, reps, exerciseType },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );

            // Refresh the food items after editing
            setAllExercises(res.data.liftingLog.concat(res.data.cardioLog));
            setLiftingExercises(res.data.liftingLog);
            setCardioExercises(res.data.cardioLog);

            // Clear the editedNutritionFacts state
            setExerciseName('');
            setSets(0);
            setReps(0);
            setTime(0);
            setExerciseType('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleExerciseTypeChange = (event) => {
        setExerciseType(event.target.value);
    }

    const handleSortChange = (event) => {
        setSortType(event.target.value);
    }

    function listItem(item) { // display an exercise
        const name = item.exerciseName;
        const id = item.hash;

        return (
            <Link to={`/exerciseInfo/${id}`} className="link">
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
                <h4 className="moreSpace">{"View Your Exercises Today:"}</h4>
                <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                    <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                        <List>
                            {
                                sortType === "all" ? allExercises.map((item) => listItem(item)) : 
                                (sortType === "cardio" ? cardioExercises.map((item) => listItem(item)) : 
                                weightLiftingExercises.map((item) => listItem(item)))
                            }
                        </List>
                    </Paper>
                </Box>
                <Box sx={{ minWidth: 120 }} className="button">
                    <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}  >
                        <InputLabel>Sort Exercises By</InputLabel>
                        <Select id="demo-simple-select" value={sortType} label="Filter" onChange={handleSortChange} classes={{ root: classes.root, select: classes.selected }} >
                            <MenuItem value={"weightLifting"}>{`Weight Lifting`}</MenuItem>
                            <MenuItem value={"cardio"}>{`Cardio`}</MenuItem>
                            <MenuItem value={"all"}>{`All`}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <Stack className="stack" spacing={2} ml={"50px"}>
                <h4 className="moreSpace">{"Add Exercise To Tracker:"}</h4>
                <div className="filter">
                    <Box sx={{ minWidth: 120 }}>
                        <div> {"Exercise Name: "}</div>
                        <input type="name" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)}/>
                        <div> {"Sets: "}</div>
                        <input type="sets" value={sets} onChange={(e) => setSets(e.target.value)}/>
                        <div> {"Reps: "}</div>
                        <input type="reps" value={reps} onChange={(e) => setReps(e.target.value)}/>
                        <div> {"Time (mins): "}</div>
                        <input type="secs" value={time} onChange={(e) => setTime(e.target.value)}/>
                    </Box>
                </div>
                <div className="filter2">
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}  >
                            <InputLabel>Exercise Type</InputLabel>
                            <Select id="demo-simple-select" value={exerciseType} onChange={handleExerciseTypeChange} label="Filter" classes={{ root: classes.root, select: classes.selected }} >
                                <MenuItem value={"Weight Lifting"}>{`Weight Lifting`}</MenuItem>
                                <MenuItem value={"Cardio"}>{`Cardio`}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Button variant="contained" color="success" size="large" className="button" onClick={handleAddExercise}> Add Exercise </Button>
                </div>
            </Stack>
        </div>
    );

};

export default ExerciseTracker;