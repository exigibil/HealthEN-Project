import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculatorPrivat } from '../redux/foodSlice'; // Ensure this path is correct
import styles from './Calculator.module.css';
import { IoReturnDownBack } from 'react-icons/io5';

function CalculatorPriv() {
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [desiredWeight, setDesiredWeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [calorieIntake, setCalorieIntake] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const forbiddenFoods = useSelector(state => state.food.forbiddenFoods || []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!height || !age || !currentWeight || !desiredWeight) {
      setError('Please fill in all required fields.');
      return;
    }

    const result = Math.round(10 * desiredWeight + 6.25 * height - 5 * age + 5);
    setCalorieIntake(result);

    setLoading(true);
    setError(null);

    try {
      const action = await dispatch(calculatorPrivat({ height, age, desiredWeight, bloodType }));

      if (action.type === 'food/calculatorPrivat/fulfilled') {
        setFormSubmitted(true);
      } else if (action.type === 'food/calculatorPrivat/rejected') {
        setError('Failed to fetch forbidden foods.');
      }
    } catch (error) {
      console.error('Error during dispatch:', error);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
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
    setError(null);
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
                <label htmlFor="height">Height *</label>
                <input
                  id="height"
                  type="number"
                  placeholder="In cm"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  placeholder="Fill your Age"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="currentWeight">Current weight *</label>
                <input
                  id="currentWeight"
                  type="number"
                  placeholder="In kg"
                  value={currentWeight}
                  onChange={e => setCurrentWeight(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label htmlFor="desiredWeight">Desired weight *</label>
                <input
                  id="desiredWeight"
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
                        checked={bloodType === type}
                        onChange={e => setBloodType(e.target.value)}
                      />
                      <span className={styles.customRadio}></span> {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.buttonCalculator}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Start losing weight'}
              </button>
            </div>
          </form>

          {error && <div className={styles.error}>{error}</div>}
        </div>
      )}

      {formSubmitted && (
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
              {calorieIntake !== null ? calorieIntake : 'N/A'} <span>kcal</span>
            </div>
            <div className={styles.resultLine}></div>
            <div className={styles.resultTitle}>
              <h3>Forbidden foods for your blood type:</h3>
            </div>
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
        </div>
      )}
    </div>
  );
}

export default CalculatorPriv;
