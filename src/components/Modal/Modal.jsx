import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { searchFood, addFood, fetchDiary } from '../redux/foodSlice';
import { debounce } from 'lodash';
import ReactDatePicker from 'react-datepicker';
import CustomInput from '../Custominput/CustomInput';

function Modal({ onClose, selectedDate, setSelectedDate, isLoading }) {
  const dispatch = useDispatch();
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const allProducts = useSelector(state => state.food.items);

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

  const formatDate = (dateInput) => {
    let date;
  
    if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      date = new Date(dateInput);
    }
  
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
  
    return date.toISOString(); 
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

  const totalKcal =
    selectedProduct && quantity
      ? (
          (selectedProduct.calories / selectedProduct.weight) *
          parseFloat(quantity)
        ).toFixed(2)
      : 0;

      const handleAddFood = () => {
        if (foodName && quantity && !isNaN(quantity)) {
          const product = allProducts.find(
            p => p.title.toLowerCase() === foodName.toLowerCase()
          );
      
          if (!product) {
            alert('Product not found!');
            return;
          }
      
          const grams = parseInt(quantity, 10);
          const formattedDate = formatDate(selectedDate);
      
          console.log("Sending data:", {
            name: foodName,
            grams: grams,
            date: formattedDate,
            calories: totalKcal,
          });
      
          dispatch(
            addFood({
              name: foodName,
              grams: grams,
              date: formattedDate,
              calories: totalKcal,
            })
          )
          .unwrap()
          .then(() => {
            setFoodName('');
            setQuantity('');
            setSelectedProduct(null);
            dispatch(fetchDiary());
          })
          .catch(error => {
            console.error('Add food error:', error);
          });
        } else {
          alert('Please provide valid food name and quantity');
        }
      };
      

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Add Food for </h2>
            <div className={styles.dateText}>
            <div>{selectedDate.toDateString()}</div>
            
            <div className="date-picker-container">
            <ReactDatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                customInput={
                    <CustomInput
                    value={selectedDate ? formatDate(selectedDate) : ""}
                  />
                }
                dateFormat="dd-MM-yy"
                className="date-picker"
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

            {showSearchResults && filteredProducts.length > 0 && (
                <div className={styles.searchContainer}>
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
                        {product.title} - {product.calories} kcal/{product.weight}g
                    </li>
                    ))}
                </ul>
                </div>
            )}
            </div>

            <div className={styles.buttonContainer}>
            <button onClick={handleAddFood} disabled={isLoading}>
                <span>+</span>
            </button>
            
            </div>
            {isLoading && <div className={styles.loading}>Loading...</div>}
      </div>
    </div>
  );
}

export default Modal;
