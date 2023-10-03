/* React page for food tracking */
import Navbar from "../../components/navbar/navbar";
import "./foodTracker.scss";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";

/**
 * Returns a react component consisting of the Food Tracking page. 
 * Includes all logic relevant to logging in.
 * 
 * @returns a react component consisting of the Food Tracking page.
 */
const FoodTracker = () => {
    const { user } = useContext(AuthContext);
    const userId = user._id;
    const [foodItems, setFoodItems] = useState([]);
    const [editedNutritionFacts, setEditedNutritionFacts] = useState({
      foodName: "",
      calories: "",
      fat: "",
      protein: "",
      carbohydrates: "",
    });
  
    const getFoodItems = async () => {
      try {
        const response = await axios.get(`users/getAllFood/${userId}`, {
          headers: {
            token: `Bearer ${user.accessToken}`,
          },
        });
        const foodData = response.data;

        // Convert the object into an array of key-value pairs
        const foodItemsArray = Object.entries(foodData);
  
         // Check if the array is not empty before setting it in state
         if (foodItemsArray.length > 0) {
            //do not want the default values, the values we want start at index 4
            const slicedFoodItems = foodItemsArray.slice(4);
            setFoodItems(slicedFoodItems);
            console.log(slicedFoodItems);
         } else {
            setFoodItems([]);
         }
      } catch (error) {
        console.log(error);
      }
    };
  
    const deleteFoodItem = async (foodName) => {
      try {
        await axios.delete(`users/deleteFood/${userId}/${foodName}`, {
          headers: {
            token: `Bearer ${user.accessToken}`,
          },
        });
         // Remove the deleted food item from the list
        const updatedFoodItems = foodItems.filter((item) => item[0] !== foodName);
        setFoodItems(updatedFoodItems);
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleEditNutritionFacts = async () => {
      const { foodName, calories, fat, protein, carbohydrates } = editedNutritionFacts;
      try {
        await axios.put(
          `users/addEdit/${userId}`,
          {
            foodName,
            calories,
            fat,
            protein,
            carbohydrates,
          },
          {
            headers: {
              token: `Bearer ${user.accessToken}`,
            },
          }
        );
        // Refresh the food items after editing
        getFoodItems();
        // Clear the editedNutritionFacts state
        setEditedNutritionFacts({
          foodName: "",
          calories: "",
          fat: "",
          protein: "",
          carbohydrates: "",
        });
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      getFoodItems();
    }, [userId]);
  
    return (
      <div className="foodTracker">
      <Navbar />
         <h1>Food List</h1>
    <ul>
      {foodItems.map((slicedFoodItems, index) => (
        <li key={index}>
          {slicedFoodItems[0]}: {/* Food name */}
          <ul>
            <li>Calories: {slicedFoodItems[1].calories}</li>
            <li>Protein: {slicedFoodItems[1].protein}</li>
            <li>Fat: {slicedFoodItems[1].fat}</li>
            <li>Carbohydrates: {slicedFoodItems[1].carbohydrates}</li>
          </ul>
          <button onClick={() => deleteFoodItem(slicedFoodItems[0])}>Delete</button>
        </li>
      ))}
    </ul>
        <div>
          <h2>Add New Food or Edit existing food</h2>
          <label>
            Food Name:
            <input
              type="text"
              value={editedNutritionFacts.foodName}
              onChange={(e) =>
                setEditedNutritionFacts({
                  ...editedNutritionFacts,
                  foodName: e.target.value,
                })
              }
            />
          </label>
          <label>
            Calories:
            <input
              type="text"
              value={editedNutritionFacts.calories}
              onChange={(e) =>
                setEditedNutritionFacts({
                  ...editedNutritionFacts,
                  calories: e.target.value,
                })
              }
            />
          </label>
          <label>
            Protein:
            <input
              type="text"
              value={editedNutritionFacts.protein}
              onChange={(e) =>
                setEditedNutritionFacts({
                  ...editedNutritionFacts,
                  protein: e.target.value,
                })
              }
            />
          </label>
          <label>
            Fat:
            <input
              type="text"
              value={editedNutritionFacts.fat}
              onChange={(e) =>
                setEditedNutritionFacts({
                  ...editedNutritionFacts,
                  fat: e.target.value,
                })
              }
            />
          </label>
          <label>
            Carbohydrates:
            <input
              type="text"
              value={editedNutritionFacts.carbohydrates}
              onChange={(e) =>
                setEditedNutritionFacts({
                  ...editedNutritionFacts,
                  carbohydrates: e.target.value,
                })
              }
            />
          </label>
          <button onClick={handleEditNutritionFacts}>Enter Nutrition Facts</button>
        </div>
      </div>
    );
  };
  
  export default FoodTracker;