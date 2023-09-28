/* Authentication context / cache that stores user's session */
import AuthReducer from "./auth-reducer";
import { createContext, useEffect, useReducer } from "react";

/* Initial state of cache */
const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
};

/* Create auth context cache */
export const AuthContext = createContext(INITIAL_STATE);

/**
 * Returns the auth context cache provider
 * @param {*} children child components
 * @returns auth context cache
 */
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};