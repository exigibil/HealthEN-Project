import React, { useState, useEffect } from 'react';
import styles from './Diary.module.css';
import Modal from '../Modal/Modal';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from '../Footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDiary, fetchFood, deleteFood } from '../redux/foodSlice';
import { getDiary } from '../redux/selectors';
import CustomInput from '../Custominput/CustomInput';

function Diary() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const diaryEntries = useSelector(getDiary);
  const isLoading = useSelector(state => state.food.isLoading);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    dispatch(fetchDiary());
    dispatch(fetchFood());
  }, [dispatch]);

  // Helper function to format date as DD-MM-YY
  const formatDate = dateInput => {
    let date;
    if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      date = new Date(dateInput);
    }
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  // Format diary entries into a more usable structure
  const formatDiaryEntries = () => {
    return diaryEntries.map(entry => {
      const date = new Date(entry.date || entry.createdAt);

      const totalCaloriesForEntry = entry.foodItems.reduce(
        (total, foodItem) => total + foodItem.calories,
        0
      );

      return {
        date,
        totalCaloriesForEntry: totalCaloriesForEntry.toFixed(2),
        foods: entry.foodItems.map(foodItem => ({
          id: foodItem._id,
          name: foodItem.name,
          grams: foodItem.grams,
          calories: foodItem.calories.toFixed(2),
          date: new Date(foodItem.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
        })),
      };
    });
  };

  // Filter diary entries based on selected date
  const filterDiaryEntriesByDate = () => {
    const formattedSelectedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    return formatDiaryEntries().filter(entry =>
      entry.foods.some(food => {
        const foodDate = new Date(food.date).toISOString().split('T')[0];
        return foodDate === formattedSelectedDate;
      })
    );
  };

  const diaryEntriesFiltered = filterDiaryEntriesByDate();

  // Handler to delete a food item
  const handleDelete = foodItemId => {
    dispatch(deleteFood(foodItemId))
      .unwrap()
      .then(() => {
        dispatch(fetchDiary());
      })
      .catch(error => {
        console.error('Delete food error:', error);
      });
  };

  return (
    <>
      <div className={styles.diaryContainer}>
        <h2>Your Food Diary</h2>

        <div className={styles.calendarContainer}>
          <div className={styles.dateText}>
            {selectedDate ? selectedDate.toDateString() : 'Select a date'}
          </div>
          <div className="date-picker-container">
            <ReactDatePicker
               onChange={date => setSelectedDate(date)}
              customInput={
                <CustomInput
                  value={selectedDate ? formatDate(selectedDate) : ''}
                />
              }
              dateFormat="dd-MM-yy"
              className="date-picker"
            />
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={toggleModal}>Add Food</button>
        </div>

        <div className={styles.diaryEntries}>
          {diaryEntriesFiltered.length > 0 ? (
            diaryEntriesFiltered.map((entry, index) => (
              <div key={index} className={styles.diaryEntry}>
                <div className={styles.foodItemsContainer}>
                  {entry.foods.map((food, idx) => (
                    <div key={idx} className={styles.foodItem}>
                      <div className={styles.itemAdd}>
                        <div>{formatDate(food.date)}</div>
                        <div>{food.name}</div>
                        <div>{food.grams} g</div>
                        <div>{food.calories} Kcal</div>
                      </div>
                      <div>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(food.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No food items for this date.</p>
          )}
        </div>

        {showModal && (
          <Modal
            onClose={toggleModal}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isLoading={isLoading}
          />
        )}
      </div>
      <Footer selectedDate={selectedDate} />
    </>
  );
}

export default Diary;
