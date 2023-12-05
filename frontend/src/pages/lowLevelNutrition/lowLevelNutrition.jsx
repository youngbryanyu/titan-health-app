import Navbar from "../../components/navbar/navbar";
import "./lowLevelNutrition.scss";
import axios from 'axios';
import { AuthContext } from "../../utils/authentication/auth-context";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

// TODO: add input validation

/**
 * Returns a react component consisting of the nutrition goal age
 * 
 */
const NutrtionGoals = () => {
    const { user } = useContext(AuthContext); // get user from auth context
    const userId = user._id;

    /* Existing user info to be displayed */
    const [calories, setCalories] = useState('');
    const [carbohydrates, setCarbohydrates] = useState('');
    const [fat, setFat] = useState('');
    const [protein, setProtein] = useState('');

    /* User info to be changed to (in input boxes) */
    const [newCalories, setNewCalories] = useState('');
    const [newCarbohydrates, setNewCarbohydrates] = useState('');
    const [newFat, setNewFat] = useState('');
    const [newProtein, setNewProtein] = useState('');

    /* retrieve low level nutrition facts */
    const getNutritionInfo = () => {
        axios.get('users/nutrition/' + user._id, {
            headers: {
                token: "Bearer " + user.accessToken
            }
        }).then(res => {
            setCalories(res.data.calories);
            setCarbohydrates(res.data.carbohydrates);
            setFat(res.data.fat);
            setProtein(res.data.protein);
        }).catch(err => {
            console.log(err)
        })
    };

    /* get user info on first render */
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current === true) {
            getNutritionInfo();
            isFirstRender.current = false;
        }
    });


    /* Updates username when user initiates through the UI */
    const updateCalories = async (e) => {
        /* Prevent default event behavior */
        e.preventDefault();

        try {
            await axios.put(`users/nutrition/${user._id}`, {
                userId: userId,
                newEntry: {
                    calories: newCalories,
                },
            }, {
                headers: {
                    token: "Bearer " + user.accessToken
                }
            });

        } catch (err) {
        
            console.log(err);
        }

        /* Load and display new user information */
        getNutritionInfo();
    };

    /* Updates email when user initiates through the UI */
    const updateCarbohydrates= async (e) => {
        /* Prevent default event behavior */
        e.preventDefault();

        try {
            await axios.put(`users/nutrition/${user._id}`, {
                userId: userId,
                newEntry: {
                    carbohydrates: newCarbohydrates,
                },
            }, {
                headers: {
                    token: "Bearer " + user.accessToken
                }
            });

        } catch (err) {
        
            console.log(err);
        }
        /* Load and display new user information */
        getNutritionInfo();
    };

    /* Updates phone number when user initiates through the UI */
    const updateProtein = async (e) => {
        /* Prevent default event behavior */
        e.preventDefault();

        try {
            await axios.put(`users/nutrition/${user._id}`, {
                userId: userId,
                newEntry: {
                    protein: newProtein,
                },
            }, {
                headers: {
                    token: "Bearer " + user.accessToken
                }
            });

        } catch (err) {
        
            console.log(err);
        }

        /* Load and display new user information */
        getNutritionInfo();
    };

    /* Updates password when user initiates through the UI */
    const updateFat = async (e) => {
        /* Prevent default event behavior */
        e.preventDefault();
        /* Make HTTP request to update info */
        try {
            await axios.put(`users/nutrition/${user._id}`, {
                userId: userId,
                newEntry: {
                    fat: newFat,
                },
            }, {
                headers: {
                    token: "Bearer " + user.accessToken
                }
            });

        } catch (err) {
        
            console.log(err);
        }

        /* Load and display new user information */
        getNutritionInfo();
    };

    return (
        <div className="personalInfo">
            <Navbar />

            <div className="personalInfoForm">
                <div className="container">
                    <form>
                        <h1>Nutrition Goals</h1>
                        <button type='button' className="infoButton">Calories: <span>{calories}</span> </button>
                        <button type='button' className="infoButton">Protein: <span>{protein}</span></button>
                        <button type='button' className="infoButton">Carbohydrates: <span>{carbohydrates}</span></button>
                        <button type='button' className="infoButton">Fat: <span>{fat}</span></button>

                        <label>
                            <div className="infoType"> {"Change calories: "}</div>
                            <input
                                type="calories"
                                value={newCalories}
                                onChange={(e) => setNewCalories(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && updateCalories(e)}
                            />
                            <button onClick={updateCalories} className="formButton">Submit</button>

                        </label>

                        <label>
                            <div className="infoType"> {"Change protein: "}</div>
                            <input
                                type="protein"
                                value={newProtein}
                                onChange={(e) => setNewProtein(e.target.value)}
                                className="input"
                                onKeyDown={(e) => e.key === 'Enter' && updateProtein(e)}
                            />
                            <button onClick={updateProtein} className="formButton">Submit</button>
                        </label>

                        <label>
                            <div className="infoType"> {"Change carbohydrates: "}</div>
                            <input
                                type="carbohydrates"
                                value={newCarbohydrates}
                                onChange={(e) => setNewCarbohydrates(e.target.value)}
                                className="input"
                                onKeyDown={(e) => e.key === 'Enter' && updateCarbohydrates(e)}
                            />
                            <button onClick={updateCarbohydrates} className="formButton">Submit</button>
                        </label>

                        <label>
                            <div className="infoType"> {"Change Fat: "}</div>
                            <input
                                type="fat"
                                value={newFat}
                                onChange={(e) => setNewFat(e.target.value)}
                                className="input"
                                onKeyDown={(e) => e.key === 'Enter' && updateFat(e)}
                            />
                            <button onClick={updateFat} className="formButton">Submit</button>
                        </label>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NutrtionGoals;
