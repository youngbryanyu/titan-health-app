/* Determines what to set the user to depedending on the login state */

/**
 * Helper function that determines what to return when the user logs in. Returns null if authentication fails.
 * Returns a cache of the user's current session if successful.
 * 
 * @param {*} state authentication state
 * @param {*} action other payload
 * @returns null if authentication fails and a cache of the user's current session if successful.
 */
const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: true,
            };
        case "LOGOUT":
            return {
                user: null,
                isFetching: false,
                error: false,
            };
        default:
            return { ...state };
    }
};

export default AuthReducer;