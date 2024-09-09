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
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAddFood = () => {
    // Caută produsul în JSON
    const product = productsData.find(p => p.title.toLowerCase() === foodName.toLowerCase());

    if (product && quantity) {
      // Calculează caloriile în funcție de greutatea introdusă
      const calories = (product.calories / 100) * quantity;

      const newFood = {
        name: product.title,
        quantity,
        calories: parseInt(calories),
      };

      setFoods([...foods, newFood]);
      setFoodName('');
      setQuantity('');
    }
  };

  const totalKcal = foods.reduce((total, food) => total + food.calories, 0);

  return (
    <>
      <div className={styles.diaryContainer}>
        <h2>Your Food Diary</h2>

        <div className={styles.calendarContainer}>
          <ReactDatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            customInput={<FaRegCalendarAlt className={styles.calendarIcon} />}
            className={styles.datePicker}
          />

          <div className={styles.date}>
            <div className={styles.dateText}>
              {selectedDate ? selectedDate.toDateString() : 'Select a date'}
            </div>
          </div>
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

        <ul className={styles.foodList}>
          {foods.map((food, index) => (
            <li key={index}>
              {food.name} - {food.quantity}g - {food.calories} kcal
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default Diary;
