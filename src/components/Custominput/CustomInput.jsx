import React, { forwardRef } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import styles from './CustomInput.module.css';

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className={styles.dateButton} onClick={onClick} ref={ref}>
    <FaRegCalendarAlt className={styles.calendarIcon} />
    <span className={styles.dateText}>{value}</span> 
  </button>
));

export default CustomInput;
