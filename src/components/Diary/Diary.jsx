import React, { useState, useEffect } from 'react';
import styles from './Diary.module.css';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from 'components/Footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchDiary,
  fetchFood,
  searchFood,
  addFood,
  deleteFood,
} from '../redux/foodSlice';
import { getDiary, getItems } from '../redux/selectors';
import { debounce } from 'lodash';
import CustomInput from '../Custominput/CustomInput';

function Diary() {
  const dispatch = useDispatch();
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const diaryEntries = useSelector(getDiary);
  const allProducts = useSelector(getItems);
  const isLoading = useSelector(state => state.food.isLoading);

  useEffect(() => {
    dispatch(fetchDiary());
    dispatch(fetchFood());
  }, [dispatch]);

  const searchProductsByName = debounce(name => {
    if (name.trim()) {
      dispatch(searchFood({ title: name }));
    } else {
      setFilteredProducts([]);
    }
  }, 300);

  const handleSearchChange = e => {
    const name = e.target.value;
    setFoodName(name);
    setShowSearchResults(name.trim().length > 0);
    searchProductsByName(name);
  };

  useEffect(() => {
    if (allProducts) {
      const filtered = allProducts.filter(
        product =>
          product.title &&
          product.title.toLowerCase().includes(foodName.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [foodName, allProducts]);

  const formatDate = date => {
    return date.toISOString();
  };

  const handleAddFood = () => {
    if (foodName && quantity && !isNaN(quantity)) {
      const product = allProducts.find(
        p => p.title.toLowerCase() === foodName.toLowerCase()
      );

      if (!product) {
        alert('Product not found!');
        return;
      }

      const dateKey = formatDate(selectedDate);

      const grams = parseInt(quantity, 10);

      dispatch(
        addFood({
          name: foodName,
          grams: grams,
          date: dateKey,
          calories: totalKcal,
        })
      )
        .unwrap()
        .then(() => {
          setFoodName('');
          setQuantity('');
          setSelectedProduct(null);
        })
        .catch(error => {
          console.error('Add food error:', error);
        });
    } else {
      alert('Please provide valid food name and quantity');
    }
  };

  const formatDiaryEntries = () => {
    return diaryEntries.map(entry => {
      const date = new Date(entry.date || entry.createdAt).toDateString();

      const totalCaloriesForEntry = entry.foodItems.reduce(
        (total, foodItem) => {
          return total + foodItem.calories;
        },
        0
      );

      return {
        date,
        totalCaloriesForEntry: totalCaloriesForEntry.toFixed(2),
        foods: entry.foodItems.map(foodItem => ({
          name: foodItem.name,
          grams: foodItem.grams,
          calories: foodItem.calories.toFixed(2),
        })),
      };
    });
  };

  const diaryEntriesFormatted = formatDiaryEntries();

  const totalKcal =
    selectedProduct && quantity
      ? (
          (selectedProduct.calories / selectedProduct.weight) *
          parseFloat(quantity)
        ).toFixed(2)
      : 0;

      const handleDelete = foodItemId => {
        dispatch(deleteFood(foodItemId))
          .unwrap()
          .then(() => {
            console.log('Food item removed successfully');
            
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
          <div className={styles.datePicker}>
            <ReactDatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              customInput={<CustomInput />}
              className={styles.datePicker}
            />
          </div>
        </div>

        <div className={styles.seachDiary}>
          <div className={styles.foodForm}>
            <input
              type="text"
              placeholder="Product name"
              value={foodName}
              onChange={handleSearchChange}
            />
            <input
              type="number"
              placeholder="Grams"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
            <div className={styles.totalKcal}>{totalKcal} Kcal</div>
          </div>

          {showSearchResults && (
            <div className={styles.searchContainer}>
              {filteredProducts.length > 0 && (
                <ul className={styles.searchResults}>
                  {filteredProducts.map(product => (
                    <li
                      key={product._id}
                      onClick={() => {
                        setFoodName(product.title);
                        setSelectedProduct(product);
                        setShowSearchResults(false);
                      }}
                    >
                      {product.title} - {product.calories} kcal/{product.weight}
                      g
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={handleAddFood} disabled={isLoading}>
            {isLoading ? 'Adding...' : '+'}
          </button>
        </div>

        <div className={styles.diaryEntries}>
          <h3>Diary Entries</h3>
          {diaryEntriesFormatted.map((entry, index) => (
            <div key={index} className={styles.diaryEntry}>
              <div>{entry.date}</div>
              
              <div className={styles.foodItemsContainer}>
                {entry.foods.map((food, idx) => (
                  <div key={idx} className={styles.foodItem}>
                    <div>{food.name}</div>
                    <div>{food.grams}g</div>
                    <div>{food.calories} Kcal</div>
                    <div>
                      {diaryEntries.map(entry => (
                        <div key={entry._id}>
                          {entry.foodItems.map(foodItem => (
                            <div key={foodItem._id}>
                              <button
                                onClick={() => handleDelete(foodItem._id)}
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
       
      </div>
      <Footer />
    </>
  );
}

export default Diary;
