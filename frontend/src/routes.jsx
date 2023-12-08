/* Contains mapping of route names */

/**
 * Mapping of path routes to different pages.
 */
const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    SETTINGS: '/settings',
    PERSONAL_INFO: '/personalInfo',
    PREFERENCES: '/preferences',
    REPORT_PROBLEM: '/reportProblem',
    OTHER_HEALTH_TRACKER: '/otherHealthTracker',
    FOOD_INFO: '/foodInfo',
    FOOD_INFO_MENU_ITEM_ID: '/foodInfo/:menuItemID',
    FOOD_ITEM_INFO: '/foodItemInfo/:foodItemHash',
    MEAL_TRACKER: '/mealTracker',
    MENU_INFO: '/menu',
    MENU_INFO_LOCATION: '/menu/:location',
    EXERCISE_INFO: '/exerciseInfo/:exerciseHash',
    EXERCISE_TRACKER: '/exerciseTracker',
    SAVED_MENU_ITEMS: '/savedMenuItems',
    POPULAR_MENU_ITEMS: '/popularMenuItems',
    LOW_LEVEL_NUTRITION: '/lowLevelNutrition',
    RECOMMENDED_MENU_ITEMS: '/recommendedMenuItems'
}

export default ROUTES;