import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './Calculator.module.css';
import { IoReturnDownBack } from 'react-icons/io5';
import { useSelector } from 'react-redux';  
import { getIsLoggedIn } from '../redux/selectors';

function Calculator({ onStartLosingWeight })  {
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [desiredWeight, setDesiredWeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [calorieIntake, setCalorieIntake] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const isLoggedIn = useSelector(getIsLoggedIn);
  const navigate = useNavigate(); 

  const handleSubmit = e => {
    e.preventDefault();
  
    const result = (currentWeight - desiredWeight) * 10 + (height - age);
    setCalorieIntake(result);
  
    if (isLoggedIn) {
      navigate('/diary');
    } else {
      setFormSubmitted(true);
      if (onStartLosingWeight) {
        onStartLosingWeight(result); 
      }
    }
  };

  const handleReset = () => {
    setHeight('');
    setAge('');
    setCurrentWeight('');
    setDesiredWeight('');
    setBloodType('');
    setCalorieIntake(null);
    setFormSubmitted(false);
  };

  return (
    <div className={styles.calculatorContainer}>
      {!formSubmitted && (
        <div className={styles.calculatorComponent}>
          <span>
            <h2>Calculate your daily calorie intake right now</h2>
          </span>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <div className={styles.formRow}>
                <label>Height *</label>
                <input
                  type="number"
                  placeholder="In cm"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Fill your Age"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Current weight *</label>
                <input
                  type="number"
                  placeholder="In kg"
                  value={currentWeight}
                  onChange={e => setCurrentWeight(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Desired weight *</label>
                <input
                  type="number"
                  placeholder="In kg"
                  value={desiredWeight}
                  onChange={e => setDesiredWeight(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Blood type:</label>
                <div className={styles.radioGroup}>
                  {['O', 'A', 'B', 'AB'].map(type => (
                    <label className={styles.radioOption} key={type}>
                      <input
                        type="radio"
                        name="bloodType"
                        value={type}
                        onChange={(e) => setBloodType(e.target.value)}
                      />
                      <span className={styles.customRadio}></span> {type}
                    </label>
                  ))}
                </div>
              </div>

            </div>

            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.buttonCalculator}>
                Start losing weight
              </button>
            </div>
          </form>
        </div>
      )}

      {calorieIntake !== null && formSubmitted && (
        <div>
          <div className={styles.backContainer}>
            <IoReturnDownBack
              onClick={handleReset}
              className={styles.returnIcon}
            />
          </div>
          <div className={styles.resultContainer}>
            <div className={styles.resultTitle}>
              <h3>Your recommended daily calorie intake is:</h3>
            </div>

            <div className={styles.resultValue}>
              {calorieIntake} <span>kcal</span>
            </div>
            <div className={styles.resultLine}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;
