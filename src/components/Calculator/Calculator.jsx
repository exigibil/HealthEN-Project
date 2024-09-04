import React, { useState } from 'react';
import styles from './Calculator.module.css';
import { IoReturnDownBack } from 'react-icons/io5';

function Calculator() {
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [desiredWeight, setDesiredWeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [calorieIntake, setCalorieIntake] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // Noua stare pentru controlul vizibilității formularului

  const handleSubmit = e => {
    e.preventDefault();

    // Calculul rezultatului
    const result = (currentWeight - desiredWeight) * 10 + (height - age);
    setCalorieIntake(result);

    // Ascunde formularul
    setFormSubmitted(true);
  };

  const handleReset = () => {
    // Resetează formularul și afişează din nou titlul
    setHeight('');
    setAge('');
    setCurrentWeight('');
    setDesiredWeight('');
    setBloodType('');
    setCalorieIntake(null);
    setFormSubmitted(false);
  };

  return (
    <div>
      {!formSubmitted && (
        <>
          <h2>Calculate your daily calorie intake right now</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <div className={styles.formRow}>
                <label>Height * </label>
                <input
                  type="number"
                  placeholder="In cm"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Fill your Age"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <label>Current weight *</label>
                <input
                  type="number"
                  placeholder="In kg"
                  value={currentWeight}
                  onChange={e => setCurrentWeight(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <label>Desired weight *</label>
                <input
                  type="number"
                  placeholder="In kg"
                  value={desiredWeight}
                  onChange={e => setDesiredWeight(e.target.value)}
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
                        onChange={e => setBloodType(e.target.value)}
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
        </>
      )}

      {calorieIntake !== null && formSubmitted && (
        <div className={styles.resultContainer}>
          <div className={styles.backContainer}>
            <IoReturnDownBack
              onClick={handleReset}
              className={styles.returnIcon}
            />
          </div>
          <div className={styles.result}>
            <h3>Your daily calorie intake is:</h3>
            <div className={styles.resultValue}>{calorieIntake} kcal</div>
            <div>
              <h4>Foods you should not eat</h4>
              <div className={styles.foodList}>
                <span className={styles.food}>1. Sugar</span>
                <span className={styles.food}>2. White bread</span>
                <span className={styles.food}>3. White rice</span>
                <span className={styles.food}>4. White pasta</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;
