import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = ({user}) => {
    const [dates, setDates] = useState([]);
    const [calories, setCalories] = useState([]);

    useEffect(() => {

        if (!user.dates) return;

        const today = new Date();
        const datesArray = [];
        const caloriesArray = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            date.setUTCHours(0, 0, 0, 0);
            const formattedDate = date.toISOString().slice(0, 10);

            // Find matching `DailyMeal` for this date
            const dailyMeal = user.dates.find(
                (dm) =>
                    new Date(dm.date).toISOString().slice(0, 10) ===
                    date.toISOString().slice(0, 10)
            );

            datesArray.push(formattedDate);
            caloriesArray.push(dailyMeal ? (dailyMeal.breakfast_calories+dailyMeal.lunch_calories+dailyMeal.dinner_calories) || 0 : 0);
        }
        setDates(datesArray.reverse());
        setCalories(caloriesArray.reverse());
    }, [user.dates]);

    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Calories Consumed',
                data: calories,
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Bar color
                borderColor: 'rgba(54, 162, 235, 1)', // Border color
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Calories Intake per Week',
            },
        },
    };

    return <Bar data={data} options={options} />;
}

export default Graph;