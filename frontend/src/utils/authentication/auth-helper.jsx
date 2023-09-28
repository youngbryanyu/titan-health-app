/* Helper class to login and logout. */
import axios from "axios";
import { LOGIN_START, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT_SUCCESS } from "./auth-states";

/* Entry point to login logic. Makes HTTP POST request to login. */
export const login = async (user, dispatch) => {
    dispatch(LOGIN_START());
    try {
        const res = await axios.post("auth/login", user);
        dispatch(LOGIN_SUCCESS(res.data));
        return res.data; /* return promise which includes result (contains user if successful) */
    } catch (err) {
        dispatch(LOGIN_FAILURE());
    }
};

/* Entry point to log out logic. */
export const logout = async (dispatch) => {
    dispatch(LOGOUT_SUCCESS());
}

