/* Authentication actions */
// start login
export const loginStart = () => ({
    type: "LOGIN_START",
});

// on successful login
export const loginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user
});

// when login fails
export const loginFailure = () => ({
    type: "LOGIN_FAILURE",
});

// logout
export const logoutSuccess = () => ({
    type: "LOGOUT",
});