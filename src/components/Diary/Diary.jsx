import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './Diary.module.css';
import { FaRegCalendarAlt } from 'react-icons/fa';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from 'components/Footer/Footer';

function Diary() {
  const [foodsByDate, setFoodsByDate] = useState({});
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Definirea produselor direct în componentă
  const productsData = [
    { title: 'Apple', calories: 52 },
    { title: 'Banana', calories: 89 },
    // Adăugați mai multe produse aici
  ];

  const handleAddFood = () => {
    // Verifică dacă există un nume de produs și o cantitate
    if (foodName && quantity) {
      // Caută produsul în JSON
      const product = productsData.find(
        p => p.title.toLowerCase() === foodName.toLowerCase()
      );
      const calories = product ? (product.calories / 100) * quantity : 0;

      const newFood = {
        name: foodName,
        quantity,
        calories: parseInt(calories),
      };

      const dateKey = selectedDate.toDateString();

      setFoodsByDate(prevFoods => {
        const updatedFoods = {
          ...prevFoods,
          [dateKey]: [...(prevFoods[dateKey] || []), newFood],
        };
        return updatedFoods;
      });

      setFoodName('');
      setQuantity('');
    }
  };

  const selectedDateKey = selectedDate.toDateString();
  const foodsForSelectedDate = foodsByDate[selectedDateKey] || [];
  const totalKcal = foodsForSelectedDate.reduce(
    (total, food) => total + food.calories,
    0
  );

  return (
    <>
      <div className={styles.diaryContainer}>
        <span><h2>Your Food Diary</h2></span>

        <div className={styles.calendarContainer}>
          <div className={styles.date}>
            <div className={styles.dateText}>
              {selectedDate ? selectedDate.toDateString() : 'Select a date'}
            </div>
          </div>

          <div>
            <ReactDatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              customInput={<FaRegCalendarAlt className={styles.calendarIcon} />}
              className={styles.datePicker}
            />
          </div>
        </div>

        <div className={styles.foodList}>
          {foodsForSelectedDate.map((food, index) => (
            <div key={index} className={styles.foodItem}>
             <div> {food.name}</div>  
             <div>{food.quantity}g</div>
            <div>{food.calories} kcal</div>
            </div>
          ))}
        </div>
        <div className={styles.foodForm}>
          <input
            type="text"
            placeholder="Product name"
            value={foodName}
            onChange={e => setFoodName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Grams"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
          <div className={styles.kcal}> {totalKcal} Kcal</div>
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={handleAddFood}>+</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Diary;
