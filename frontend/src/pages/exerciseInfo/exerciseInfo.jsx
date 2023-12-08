// Javascript for page displaying info related to a menu item
import Navbar from "../../components/navbar/navbar";
import "./exerciseInfo.scss";
import { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { IconButton, Tooltip, List, ListItem, FormControl, InputLabel, Select, MenuItem, Typography, Box, Button } from '@mui/material';
import { Info, StarOutline, Star, BookmarkBorder, Bookmark } from '@mui/icons-material';
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
import { makeStyles } from '@mui/styles';
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

const ExerciseInfo = () => {
    
    /* Rating Info */
    const [starClick1, setStarClick1] = useState(false);
    const [starClick2, setStarClick2] = useState(false);
    const [starClick3, setStarClick3] = useState(false);
    const [starClick4, setStarClick4] = useState(false);
    const [starClick5, setStarClick5] = useState(false);
    const [savedClick, setSavedClick] = useState(false);

    /* Exercise info corresponding to input boxes */
    const [exerciseName, setExerciseName] = useState('');
    const [sets, setSets] = useState(0);
    const [reps, setReps] = useState(0);
    const [time, setTime] = useState(0);
    const [exerciseType, setExerciseType] = useState('');
    const [priorExercise, setPriorExercise] = useState();

    const { user } = useContext(AuthContext);
    const userId = user._id;
    const classes = useStyles();
    let { exerciseHash } = useParams(); // this will be undefined if no params
    const [exercise, setExercise] = useState({
        exerciseName: "",
        sets: "",
        reps: "",
        time: "",
        exerciseType: "",
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
        
        const getExerciseInfo = async () => {
            try {
                const response = await axios.get(`/users/anExercise/${userId}/${exerciseHash}`,
                { headers: { token: `Bearer ${user.accessToken}` } });
                console.log(`Bearer ${user.accessToken}`);
                const item = response.data;

                const priorCheck = await axios.get(`/users/priorExercise/${userId}/${item.exerciseName}`,
                { headers: { token: `Bearer ${user.accessToken}` } });

                if(priorCheck.data !== "No Prior History") {
                    setPriorExercise(priorCheck.data);
                } else {
                    setPriorExercise("N/A");
                }
                
                setExercise({
                    exerciseName: item.exerciseName,
                    sets: item.sets,
                    reps: item.reps,
                    time: item.time,
                    exerciseType: item.exerciseType,
                    hash: item.hash
                });
            } catch (error) { console.log(error) };
        };

        if (isFirstRender.current) {
            if (exerciseHash != null) {
                getExerciseInfo();
            }
        }
        isFirstRender.current = false;
        // eslint-disable-next-line
    }, []);

    const handleEditExercise = async () => {

        try {
            const hash = exerciseHash;
            const res = await axios.put(
                `/users/editExercise/${userId}`,
                { exerciseName, sets, reps, time, exerciseType, hash },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );

            // Refresh the food items after editing
            setExercise({
                    exerciseName: exerciseName,
                    sets: sets,
                    reps: reps,
                    time: time,
                    exerciseType: exerciseType,
                    hash: exerciseHash
                });

            // Clear the previous state
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteExercise = async () => {
        try {
            const hash = exerciseHash;
            const res = await axios.delete(
                `/users/deleteExercise/${userId}/${hash}`,
                { headers: { token: `Bearer ${user.accessToken}` } }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleExerciseTypeChange = (event) => {
        setExerciseType(event.target.value);
    }

    return (
        <div className="exerciseInfo">
            <Navbar />

            <Box sx={{ // info for exercise facts (sx provides inline style information for this component)
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
                            Exercise Facts for: &nbsp; {exercise.exerciseName}
                        </Typography>
                    </ListItem>
                    <ListItem key="sets">
                        <Typography fontWeight="bold">
                            Sets: {exercise.sets}
                        </Typography>
                    </ListItem>
                    <ListItem key="reps">
                        <Typography fontWeight="bold">
                            Reps: {exercise.reps}
                        </Typography>
                    </ListItem>
                    <ListItem key="time">
                        <Typography fontWeight="bold">
                            Time: {exercise.time}
                        </Typography>
                    </ListItem>
                    <ListItem key="type">
                        <Typography fontWeight="bold">
                            Exercise Type: {exercise.exerciseType}
                        </Typography>
                    </ListItem>
                </List>
            </Box>

            <Box sx={{ // update exercise
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
                            Edit Exercise:
                        </Typography>
                    </ListItem>
                    <ListItem key="name">
                        <Typography fontWeight="bold">
                            Exercise Name:  
                        </Typography>
                        <input type="name" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)}/>
                    </ListItem>
                    <ListItem key="sets">
                        <Typography fontWeight="bold">
                            Sets:
                        </Typography>
                        <input type="sets" value={sets} onChange={(e) => setSets(e.target.value)}/>
                    </ListItem>
                    <ListItem key="reps">
                        <Typography fontWeight="bold">
                            Reps:
                        </Typography>
                        <input type="reps" value={reps} onChange={(e) => setReps(e.target.value)} />
                    </ListItem>
                    <ListItem key="time">
                        <Typography fontWeight="bold">
                            Time:
                        </Typography>
                        <input type="duration" value={time} onChange={(e) => setTime(e.target.value)}/>
                    </ListItem>
                    <ListItem>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}  >
                                <InputLabel>Exercise Type</InputLabel>
                                <Select id="demo-simple-select" value={exerciseType} onChange={handleExerciseTypeChange} label="Filter" classes={{ root: classes.root, select: classes.selected }} >
                                    <MenuItem value={"Weight Lifting"}>{`Weight Lifting`}</MenuItem>
                                    <MenuItem value={"Cardio"}>{`Cardio`}</MenuItem>
                                    <MenuItem value={"Other"}>{`Other`}</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" color="success" size="large" className="button" onClick={handleEditExercise}> Update Exercise </Button>
                    </ListItem>
                </List>
            </Box>

            <Box sx={{ // delete exercise
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
                            Delete This Exercise:
                        </Typography>
                        <Link to={ROUTES.EXERCISE_TRACKER} className="link" onClick={handleDeleteExercise}>
                            <Button variant="contained" color="error" size="large" className="button"> Delete </Button>
                        </Link>
                    </ListItem>
                </List>
            </Box>

            <Box sx={{ //rating modal
                background: '#0b0b0b',
                width: 340,
                height: 'auto',
                overflow: 'hidden', //do not remove, will break the ratings appearance and idk why
                position: 'absolute',
                ml: 6, //left margin (percent of screen)
                mt: 63, //top margin (percent of screen)
                borderRadius: 10,
            }}>
                <Tooltip title={`Average Rating: `} placement="bottom">
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
                        Most Recent Exercise History: 
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
                    Exercises should follow proper form - ego lifting is strictly prohibited.
                </Box>
            </Box>
        </div>
    );
};

export default ExerciseInfo;