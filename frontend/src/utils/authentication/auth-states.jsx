/* Different states during login and logout */

/* Login start state*/
export const LOGIN_START = () => ({
    type: "LOGIN_START",
});

/* Successful login state */
export const LOGIN_SUCCESS = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user
});

/* Login failed state */
export const LOGIN_FAILURE = () => ({
    type: "LOGIN_FAILURE",
});

/* Logout state */
export const LOGOUT_SUCCESS = () => ({
    type: "LOGOUT",
});