import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Footer.module.css';

const Footer = ({ selectedDate }) => {
  const user = useSelector(state => state.auth.user);
  const diaryEntries = useSelector(state => state.food.diaryEntries);
  const forbiddenFoods = useSelector(state => state.food.forbiddenFoods || []);

  console.log('Diary Entries from Redux in Footer:', diaryEntries);
  console.log('Selected Date:', selectedDate);
  
  const dailyKcal = user?.dailyKcal || 0; // Use optional chaining and default to 0 if undefined
  const dateToDisplay = selectedDate ? new Date(selectedDate) : new Date();

  const totalConsumed = diaryEntries
    .flatMap(entry => entry.foodItems)
    .filter(foodItem => {
      const foodDate = new Date(foodItem.date).toISOString().split('T')[0];
      const selectedFormattedDate = dateToDisplay.toISOString().split('T')[0];
      return foodDate === selectedFormattedDate;
    })
    .reduce((total, foodItem) => total + foodItem.calories, 0);

  const totalLeft = dailyKcal - totalConsumed;
  const objectiveMessage =
    totalLeft < 0 ? "Objective achieved! You've consumed enough calories." : '';

  return (
    <div className={styles.footerContainer}>
      <div className={styles.titleDiary}>
        <span>Summary for {dateToDisplay.toLocaleDateString()} </span>
      </div>

      <div className={styles.dayStats}>
        <div className={styles.dayDiary}>
          <div>Total Kcal to consume: {dailyKcal}</div>
          <div>Consumed: {totalConsumed.toFixed(2)} Kcal</div>
          <div>Left: {totalLeft >= 0 ? totalLeft.toFixed(2) : '0'} Kcal</div>
        </div>

        <div className={styles.procentDay}>
          {totalLeft < 0
            ? objectiveMessage
            : `${((totalConsumed / dailyKcal) * 100).toFixed(
                2
              )}% of daily intake`}
        </div>
      </div>

      {user && (
        <div className={styles.forbiddenFoodsContainer}>
          <h3>Forbidden foods for your blood type:</h3>
          <ul>
            {forbiddenFoods.length > 0 ? (
              forbiddenFoods.slice(0, 5).map((food, index) => (
                <li key={food._id}>{food.title}</li>
              ))
            ) : (
              <li>No forbidden foods found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Footer;
