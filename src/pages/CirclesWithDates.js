import React, { useState, useEffect } from 'react';
import '../stylesForPages/CirclesWithDates.css'; 

const CirclesWithDates = ({ onDateClick }) => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const today = new Date();
    const datesArray = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setUTCHours(0, 0, 0, 0);
      date.setDate(today.getDate() - i);
      datesArray.push(date.toISOString().slice(0, 10));
    }

    setDates(datesArray.reverse());
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateClick(date);
  };

  return (
    <div className="circles-container">
      {dates.map((date, index) => (
        <div
          className={`circle ${selectedDate === date ? 'circle-selected' : ''}`}
          key={index}
          onClick={() => handleDateClick(date)}
        >
          <div className="circle-number">{index + 1}</div>
          <div className="circle-date">{date}</div>
        </div>
      ))}
    </div>
  );
};

export default CirclesWithDates;