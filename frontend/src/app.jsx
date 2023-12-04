/* Root component of react app */
import "./app.scss"
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Preferences from "./pages/preferences/preferences";
import MealTracker from "./pages/mealTracker/mealTracker";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./utils/authentication/auth-context";
import ROUTES from "./routes";
import Settings from "./pages/settings/settings";
import ReportProblem from "./pages/reportProblem/reportProblem";
import PersonalInfo from "./pages/personalInfo/personalInfo";
import ExerciseTracker from "./pages/exerciseTracker/exerciseTracker";
import ExerciseInfo from "./pages/exerciseInfo/exerciseInfo";
import OtherHealthTracker from "./pages/otherHealthTracker/otherHealthTracker";
import FoodInfo from "./pages/foodInfo/foodInfo";
import Menu from "./pages/menu/menu";
import MealTrackerItem from "./pages/mealTrackerItem/mealTrackerItem";
import SavedMenuItems from "./pages/savedMenuItems/savedMenuItems";
import PopularMenuItems from "./pages/popular/popular";
import LowLevelNutrition from "./pages/lowLevelNutrition/lowLevelNutrition";
import RecommendedMenuItems from "./pages/recommendedMenuItems/recommendedMenuItems";

/**
 * Returns an instance of the frontend React application.
 * 
 * @returns an instance of {@link App}
 */
const App = () => {
    /* Get user from authentication context. */
    const { user } = useContext(AuthContext);

    /* Page routes for when used is logged in. */
    const LOGGED_IN_ROUTES = (
        <>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<Home />} />
            <Route path={ROUTES.REGISTER} element={<Home />} />
            <Route path={ROUTES.PREFERENCES} element={<Preferences />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.REPORT_PROBLEM} element={<ReportProblem />} />
            <Route path={ROUTES.PERSONAL_INFO} element={<PersonalInfo />} />
            <Route path={ROUTES.MEAL_TRACKER} element={<MealTracker />} />
            <Route path={ROUTES.EXERCISE_TRACKER} element={<ExerciseTracker />} />
            <Route path={ROUTES.FOOD_ITEM_INFO} element={<MealTrackerItem />} />
            <Route path={ROUTES.EXERCISE_INFO} element={<ExerciseInfo />} />
            <Route path={ROUTES.OTHER_HEALTH_TRACKER} element={<OtherHealthTracker />} />
            <Route path={ROUTES.FOOD_INFO} element={<FoodInfo />} />
            <Route path={ROUTES.FOOD_INFO_MENU_ITEM_ID} element={<FoodInfo />} />
            <Route path={ROUTES.MENU_INFO_LOCATION} element={<Menu />} />
            <Route path={ROUTES.SAVED_MENU_ITEMS} element={<SavedMenuItems />} />
            <Route path={ROUTES.POPULAR_MENU_ITEMS} element={<PopularMenuItems />} />
            <Route path={ROUTES.LOW_LEVEL_NUTRITION} element={<LowLevelNutrition />} />
            <Route path={ROUTES.RECOMMENDED_MENU_ITEMS} element={<RecommendedMenuItems />} />
        </>
    );

    /* Page routes for when used is logged out. */
    const LOGGED_OUT_ROUTES = (
        <>
            <Route path={ROUTES.HOME} element={<Register />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.PREFERENCES} element={<Register />} />
            <Route path={ROUTES.SETTINGS} element={<Register />} />
            <Route path={ROUTES.REPORT_PROBLEM} element={<Register />} />
            <Route path={ROUTES.PERSONAL_INFO} element={<Register />} />
            <Route path={ROUTES.MEAL_TRACKER} element={<Register />} />
            <Route path={ROUTES.EXERCISE_TRACKER} element={<Register />} />
            <Route path={ROUTES.FOOD_ITEM_INFO} element={<Register />} />
            <Route path={ROUTES.EXERCISE_INFO} element={<Register />} />
            <Route path={ROUTES.OTHER_HEALTH_TRACKER} element={<OtherHealthTracker />} />
            <Route path={ROUTES.FOOD_INFO} element={<Register />} />
            <Route path={ROUTES.FOOD_INFO_MENU_ITEM_ID} element={<Register />} />
            <Route path={ROUTES.MENU_INFO_LOCATION} element={<Register />} />
            <Route path={ROUTES.SAVED_MENU_ITEMS} element={<Register />} />
            <Route path={ROUTES.POPULAR_MENU_ITEMS} element={<Register />} />
            <Route path={ROUTES.LowLevelNutrition} element={<Register />} />
            <Route path={ROUTES.RECOMMENDED_MENU_ITEMS} element={<Register />} />
        </>
    );

    /* Return react component */
    return (
        <Router>
            <Routes>
                {user ? LOGGED_IN_ROUTES : LOGGED_OUT_ROUTES}
            </Routes>
        </Router>
    );
};

export default App;

/* 
In JavaScript, there are several naming conventions that developers follow for function names, page names, file names, and variable names. These conventions help improve code readability and maintainability. Here are some common naming conventions:

Camel Case (e.g., myFunctionName, pageName, fileName):

Typically used for function names, variable names, and object keys.
The first word starts with a lowercase letter, and subsequent words are capitalized.
Common practice for most JavaScript code.
Pascal Case (e.g., MyFunctionName, PageName, FileName):

Typically used for class names and constructor functions.
Similar to camel case, but the first letter is capitalized.
Used when defining constructor functions or classes in JavaScript.
Kebab Case (e.g., my-function-name, page-name, file-name):

Typically used for filenames and URLs.
Words are separated by hyphens.
Common practice for HTML and CSS filenames and URLs.
Snake Case (e.g., my_function_name, page_name, file_name):

Less common in JavaScript but occasionally used for variable and function names.
Words are separated by underscores.
All Uppercase (e.g., CONSTANT_NAME):

Used for constants, typically with all letters in uppercase and words separated by underscores.
Common convention for defining constants in JavaScript.
Here's how these conventions apply to different naming scenarios:

Page Names: It's common to use camel case or kebab case for page names, depending on your project's naming
 convention. For example, "myPage" (camel case) or "my-page" (kebab case).

File Names: For JavaScript and TypeScript files, camel case or kebab case is often used for file names. 
For example, "myModule.js" (camel case) or "my-module.js" (kebab case).

Function Names: Camel case is the most common convention for function names. For example, "calculateTotal()" or
 "fetchUserData()".

Remember that consistency within your project is key. Choose a naming convention and stick with it throughout 
your codebase to maintain readability and make it easier for your team to collaborate. If you're working on a project with an established coding style guide, it's essential to follow the guidelines defined in that guide.
*/
