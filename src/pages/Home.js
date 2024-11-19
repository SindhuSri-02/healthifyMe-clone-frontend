import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextButton from './TextButton';
import CirclesWithDates from './CirclesWithDates'
import '../stylesForPages/Home.css'

function App() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [breakfastCalories, setBreakfastCalories] = useState(0);
    const [lunchCalories, setLunchCalories] = useState(0);
    const [dinnerCalories, setDinnerCalories] = useState(0);
    const [totalCalories,setTotalCalories] = useState(0);
    const [date,setDate] = useState('');
    const [breakfastMeals, setBreakfastMeals] = useState([])
    const [lunchMeals, setLunchMeals] = useState([])
    const [dinnerMeals, setDinnerMeals] = useState([])

    useEffect(() => {
      const onlyDate = new Date();
      onlyDate.setUTCHours(0, 0, 0, 0);
      setDate(onlyDate.toISOString().slice(0, 10)); 
    }, []);

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const caloriesChange = (mealType, calories) => {
        if (mealType === 'breakfast') {
            setBreakfastCalories(calories);
        } else if (mealType === 'lunch') {
            setLunchCalories(calories);
        } else if (mealType === 'dinner') {
            setDinnerCalories(calories);
        }
    };

    useEffect(() => {
      setTotalCalories((
        parseFloat(breakfastCalories) +
        parseFloat(lunchCalories) +
        parseFloat(dinnerCalories)
      ).toFixed(2));
    }, [breakfastCalories, lunchCalories, dinnerCalories]);

    const navigate = useNavigate();

    function userProfile() {
        setTimeout(() => {
            navigate('/user');
        }, 1000);
    }

    const selectDate = (selectedDate) => {
      setDate(selectedDate)
    } 

    useEffect(() => {
      if (!date) return; 

      async function fetchMealsPerDay() {
          try {

              const token = localStorage.getItem('token')
              const response = await fetch(`http://localhost:1337/api/journal/date/${date}`, {
                  method: 'GET',
                  headers: {
                    'authorization': token
                }
              });
              const jsonBody = await response.json();
              if (jsonBody.success && jsonBody.meals) {
                setBreakfastMeals(jsonBody.meals.breakfast);
                setLunchMeals(jsonBody.meals.lunch);
                setDinnerMeals(jsonBody.meals.dinner);
              }
          } catch (error) {
              console.error("Error fetching meals:", error);
          }
      }

      fetchMealsPerDay();
  }, [date]);


    return (
        <div>
            <div className="header">
                <h1 className="homeTitle">HOME</h1>
                {loggedInUser && (
                    <div className="userCircle" onClick={userProfile}>
                        {loggedInUser.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <CirclesWithDates onDateClick={selectDate} />
            <h3 className="totalCalories">CALORIES: {totalCalories}</h3>
            <div>
                <TextButton type="breakfast" onCaloriesChange={(calories) => caloriesChange('breakfast', calories)} date={date} initialMeals={breakfastMeals} />
                <TextButton type="lunch" onCaloriesChange={(calories) => caloriesChange('lunch', calories)} date={date} initialMeals={lunchMeals} />
                <TextButton type="dinner" onCaloriesChange={(calories) => caloriesChange('dinner', calories)} date={date} initialMeals={dinnerMeals} />
            </div>
        </div>
    );
}

export default App;
