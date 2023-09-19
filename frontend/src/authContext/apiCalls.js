/* API calls with auth */
import axios from "axios";
import { loginFailure, loginStart, loginSuccess, logoutSuccess } from "./AuthActions";

export const login = async (user, dispatch) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("auth/login", user);
        dispatch(loginSuccess(res.data));
        return res.data; // return promise which includes result (contains user if successful)
    } catch (err) {
        dispatch(loginFailure());
    }
};

export const logout = async (dispatch) => {
    dispatch(logoutSuccess());
}

// on frontend page do updatePreferences({id: , other stuff})
export const updatePreferences = async (user) => {
    try {
        const res = await axios.put(`users/${user.id}`, user);
        return res.data; // return promise which is json of updated user 
    } catch (err) {
        console.log("updatePreferences Failed!")
    }
};