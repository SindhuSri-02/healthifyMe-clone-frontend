import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Report from './Report'
import '../stylesForPages/User.css';

function App() {
    const userName = localStorage.getItem('loggedInUser');
    const [email, setEmail] = useState('');
    const [meals, setMeals] = useState([]);
    const [user,setUser] = useState({})
    
    useEffect(() => {
        async function getUser() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:1337/api/users/userProfile`, {
                    method: 'GET',
                    headers: {
                        'authorization': token,
                    },
                });
                const jsonResponse = await response.json();
                if (jsonResponse.success) {
                    setUser(jsonResponse.user);
                    setEmail(jsonResponse.user.email);
                    setMeals(jsonResponse.user.meals);
                } else {
                    console.log(jsonResponse);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, []);

    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    }

    function redirectToHome(){
        setTimeout(() => {
            navigate('/home');
        }, 1000);
    }

    const handleRemoveMeal = async (mealId) => {
        try{
        const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:1337/api/users/meal/${mealId}`, {
                    method: 'Delete',
                    headers: {
                        'authorization': token,
                    },
                });
                const jsonResponse = await response.json();
                if (jsonResponse.success) {
                    setMeals((prevMeals) => prevMeals.filter((meal) => meal._id !== mealId));
                } else {
                    console.log(jsonResponse);
                }
            } catch (error) {
                console.log(error);
            }
    };

    return (
        <div className="userProfileContainer">
            {/* Cross Button */}
            <button className="crossButton" onClick={redirectToHome}>
                ✖
            </button>
    
            {/* Left Panel */}
            <div className="leftPanel">
                <div className="headerUser">
                    <h2>Hello, {userName}</h2>
                    <h3>{email}</h3>
                </div>
                <div className="graphContainer">
                    <Report user={user}/>
                </div>
                <button className="logoutButton" onClick={handleLogout}>
                    Logout
                </button>
            </div>
    
            {/* Right Panel */}
            <div className="rightPanel">
                <div className="mealsList">
                    <h4>Created Meals</h4>
                    <ul>
                        {meals.map((meal, index) => (
                            <li key={meal._id || index} className="mealCard">
                                <div className="mealInfo">
                                    <span>{meal.name}</span>
                                    <span>{meal.calories} cal | {meal.servings} grams</span>
                                </div>
                                <button
                                    className="removeButton"
                                    onClick={() => handleRemoveMeal(meal._id)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );           
}

export default App;