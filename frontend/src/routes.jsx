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
    FOOD_TRACKER: '/foodTracker',
    MEAL_TRACKER: '/mealTracker',
    FOOD_ITEM_INFO: '/foodItemInfo/:foodItemHash',
    EXERCISE_TRACKER: '/exerciseTracker',
    EXERCISE_INFO: '/exerciseInfo/:exerciseHash'
}

export default ROUTES;