/* Contains mapping of route names */

/**
 * Mapping of path routes to different pages.
 */
const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    SETTINGS: '/settings',
    PREFERENCES: '/preferences',
    REPORT_PROBLEM: '/reportProblem',
    PERSONAL_INFO: '/personalInfo',
    OTHER_HEALTH_TRACKER: '/otherHealthTracker',
    FOOD_INFO: '/foodInfo',
    FOOD_INFO_MENU_ITEM_ID: '/foodInfo/:menuItemID',
    FOOD_TRACKER: '/foodTracker',
    MEAL_TRACKER: '/mealTracker',
    MENU_INFO: '/menu',
    MENU_INFO_LOCATION: '/menu/:location',
    FOOD_ITEM_INFO: '/foodItemInfo/:foodItemHash',
    EXERCISE_TRACKER: '/exerciseTracker',
    EXERCISE_INFO: '/exerciseInfo/:exerciseHash'
}

export default ROUTES;