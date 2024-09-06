import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import styles from './Diary.module.css';

function Diary() {
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState(''); // Câmpul pentru kilocalorii

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login'); // Redirecționează la pagina de login după logout
  };

  const handleAddFood = () => {
    if (foodName && quantity && calories) {
      const newFood = { name: foodName, quantity, calories };
      setFoods([...foods, newFood]);
      setFoodName('');
      setQuantity('');
      setCalories('');
    }
  };

  return (
    <>
      <div className={styles.backContainer}>
        <div className={styles.userName}>Welcome, {user.name}</div>
        <div className={styles.dash}></div>
        <div className={styles.exitContainer} onClick={handleLogout}>
          <ImExit className={styles.exitIcon} /> <span>Exit</span>
        </div>
      </div>

      <div className={styles.diaryContainer}>
        <h2>Your Food Diary</h2>

        <div className={styles.foodForm}>
          <input
            type="text"
            placeholder="Food name"
            value={foodName}
            onChange={e => setFoodName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity (grams)"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
          <input
            type="number"
            placeholder="Kilocalories"
            value={calories}
            onChange={e => setCalories(e.target.value)}
          />
          <button onClick={handleAddFood}>Add Food</button>
        </div>

        <ul className={styles.foodList}>
          {foods.map((food, index) => (
            <li key={index}>
              {food.name} - {food.quantity}g - {food.calories} kcal
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Diary;
