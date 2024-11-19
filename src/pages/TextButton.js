import React, { useEffect, useState, useCallback} from 'react';
import '../stylesForPages/TextButton.css'

const TextButton = ({ type, onCaloriesChange, date, initialMeals }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [meals, setMeals] = useState(null);
    const [savedMeals, setSavedMeals] = useState([]);
    const [sumOfCalories, setSumOfCalories] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [mealName, setMealName] = useState('')
    const [ownMeals, setOwnMeals] = useState([])

    useEffect(() => {
        onCaloriesChange(sumOfCalories);
    }, [sumOfCalories, onCaloriesChange]);

    const updateCalories = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`process.env.BACKEND_URL/api/journal/date/${date}/type/${type}/calories`, {
                method: 'GET',
                headers: {
                    'authorization': token
                }
            });
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const jsonResponse = await response.json();
                if (jsonResponse.success) {
                    setSumOfCalories(jsonResponse.calories);
                }
            } else {
                console.error('Unexpected response type', response);
            }
        } catch (error) {
            console.error("Error fetching calories:", error);
        }
    }, [date, type]);

    useEffect(() => {
        async function fetchInitialCalories() {
            if (initialMeals && Array.isArray(initialMeals)) {
                setSavedMeals(initialMeals)
                await updateCalories()
            }
        }
    
        fetchInitialCalories()
    }, [initialMeals, updateCalories]);

    const handleAddMealClick = async () => {
        setMeals(null);
        setShowSearch(true);
        await fetchOwnMeals();
    };

    const fetchOwnMeals = useCallback(async() => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`process.env.BACKEND_URL/api/meals/`, {
                method: 'GET',
                headers: {
                    'authorization': token
                }
            });
            const jsonBody = await response.json();
            if (jsonBody.success) {
                setOwnMeals(jsonBody.meals);
            }
        } catch (error) {
            console.error("Error fetching meals:" , error);
        }
    },[])

    async function fetchMeal() {
        try {
            const response = await fetch(`process.env.BACKEND_URL/api/meals/${searchQuery}`, {
                method: 'GET'
            });
            const jsonBody = await response.json();
            if (jsonBody.success) {
                setMeals(jsonBody.meal.items);
            }
        } catch (error) {
            console.error("Error fetching meals:" , error);
        }
    }

    async function handleMealClick(meal) {
        try {
            const {
                name,
                serving_size_g: servings = meal.servings || 0,
                calories,
                protein_g: protein = meal.protein || 0,
                carbohydrates_total_g: carbohydrates = meal.carbohydrates || 0,
                fiber_g: fiber = meal.fiber || 0,
                sugar_g: sugar = meal.sugar || 0,
            } = meal;

            const payload = {
                name,
                servings,
                calories,
                protein,
                carbohydrates,
                fiber,
                sugar,
            }

            const token = localStorage.getItem('token')

            const response = await fetch(`process.env.BACKEND_URL/api/journal/date/${date}/type/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                },
                body: JSON.stringify(payload)
            });

            const jsonResponse = await response.json();

            if (jsonResponse.success) {
                if(jsonResponse.found){
                    setSavedMeals(prevMeals => {
                        return prevMeals.map(entry => {
                            if (entry.meal._id === jsonResponse.meal.meal) {
                                return { ...entry, quantity: entry.quantity + 1 };
                            }
                            return entry;
                        });
                    });
                }else{
                    setSavedMeals((prevMeals) => [...prevMeals, jsonResponse.meal]);
                }
                setMeals(null);
                setShowSearch(false);
                await updateCalories()
            } else {
                console.log("Failed to add meal:", jsonResponse);
            }
        } catch (error) {
            console.log("Error adding meal:", error);
        }
    }

    const removeMeal = async (index, meal) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`process.env.BACKEND_URL/api/journal/date/${date}/type/${type}/meal/${meal._id}`, {
                    method: 'DELETE',
                    headers: {
                        'authorization': token
                    }
            });

            const jsonResponse = await response.json();

            if (jsonResponse.success) {
                setSavedMeals((prevMeals) => prevMeals.filter((_, i) => i !== index));
                await updateCalories()
            } else {
                console.log("Failed to remove meal:", jsonResponse);
            }
        } catch(error) {
            console.log("Failed to remove meal:", error);
        }
    }

    const increaseQuantity = async (meal,index) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`process.env.BACKEND_URL/api/journal/date/${date}/type/${type}/meal/${meal._id}/inc`, {
                    method: 'POST',
                    headers: {
                        'authorization': token
                    }
            });

            const jsonResponse = await response.json();

            if (jsonResponse.success) {
                setSavedMeals(prevMeals => {
                    const updatedMeals = [...prevMeals];
                    updatedMeals[index].quantity += 1;
                    return updatedMeals;
                });
                await updateCalories()
            } else {
                console.log("Failed to increase quantity:", jsonResponse);
            }
        } catch(error) {
            console.log("Failed to increase quantity:", error);
        }
    };

    const decreaseQuantity = async (meal, index) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`process.env.BACKEND_URL/api/journal/date/${date}/type/${type}/meal/${meal._id}/dec`, {
                    method: 'POST',
                    headers: {
                        'authorization': token
                    }
            });

            const jsonResponse = await response.json();

            if (jsonResponse.success) {
                setSavedMeals(prevMeals => {
                    const updatedMeals = [...prevMeals];
                    if (updatedMeals[index].quantity > 1) {
                        updatedMeals[index].quantity -= 1;
                    }
                    return updatedMeals;
                });
                await updateCalories()
            } else {
                console.log("Failed to decrease quantity:", jsonResponse);
            }
        } catch(error) {
            console.log("Failed to decrease quantity:", error);
        }
    };

    const settingForm = () =>{
        setShowForm(true);
    }

    const createMeal = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`process.env.BACKEND_URL/api/meals`, {
                method: 'POST',
                headers: {
                    'authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'meals' :savedMeals,
                    'name' : mealName
                })
            });

            const jsonResponse = await response.json();

            if (!jsonResponse.success){
                console.log("Failed to add meal", jsonResponse);
            }
            setShowForm(false);
        } catch(error) {
            console.log("Failed to add meal", error);
        }
    }

    return (
        <div className="container">

            <div className="typeCaloriesHeader">
                <h3 className="typeText">{type}</h3>
                <p className="caloriesText">
                    {sumOfCalories} <small>cal</small>
                </p>
            </div>

            <button className="button" onClick={handleAddMealClick}>Add Meal</button>

            {showSearch && (
                    <div className="searchContainer">
                        <input
                            type="text"
                            placeholder="Search for a meal"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="searchInput"
                        />
                        <button className="button" onClick={fetchMeal}>Search</button>
                    </div>
            )}

            {
                showSearch && ownMeals && (
                        <div>
                            <ul>
                            {ownMeals.map((meal, index) => (
                                <li key={meal._id || index} onClick={() => handleMealClick(meal)}>
                                    {meal.name} - {meal.calories} cal per {meal.servings} grams
                                </li>
                            ))}
                            </ul>
                        </div>
                    )
            }

            {meals && (
                <div>
                    <ul>
                        {meals.map((meal, index) => (
                            <li key={index} onClick={() => handleMealClick(meal)}>
                                {meal.name} - {meal.calories} cal per {meal.serving_size_g} grams
                            </li>
                        ))}
                    </ul>
                </div>
            )}



            {savedMeals && (
                <div>
                    <ul>
                    {savedMeals.map((meal, index) => (
                        <li className="mealCard" key={index}>
                        <div className="mealDetails">
                            <span className="mealName">{meal.meal.name}</span>
                            <span className="mealInfo">
                            {meal.meal.calories} cal | {meal.meal.servings} grams
                            </span>
                        </div>
                        <div className="quantityControls">
                            <button
                            className="quantityButton"
                            onClick={() => increaseQuantity(meal, index)}
                            >
                            +
                            </button>
                            <span className="quantity">{meal.quantity}</span>
                            <button
                            className="quantityButton"
                            onClick={() => decreaseQuantity(meal, index)}
                            >
                            −
                            </button>
                        </div>
                        <button
                            className="removeButton"
                            onClick={() => removeMeal(index, meal)}
                        >
                            Remove
                        </button>
                        </li>
                    ))}
                    </ul>

                </div>
            )}

            {savedMeals.length>0?(<button className="button" onClick={settingForm}>create meal</button>):(<span>no meals yet</span>)}
            {showForm && (
                <div className="searchContainer">
                    <input
                        type="text"
                        placeholder="meal name"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)} 
                        className="searchInput"
                    />
                    <button className="button" onClick={createMeal}>create</button>
                </div>
            )}
        </div>
    );
};

export default TextButton;