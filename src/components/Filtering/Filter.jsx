import React from 'react';
import styles from '../Phonebook/Phonebook.module.css';
import { setFilter } from '../redux/filterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getFilter } from '../redux/selectors';

function ContactFilter() {
  const dispatch = useDispatch();
  const filter = useSelector(getFilter);

  const handleSearchChange = e => {
    const value = e.target.value;
    dispatch(setFilter(value.toLowerCase()));
  };

  return (
    <div>
      <label htmlFor="filterInput" className={styles.label}>
        Search by name:
      </label>
      <input
        id="filterInput"
        className={styles.inputText}
        type="text"
        value={filter}
        onChange={handleSearchChange}
        placeholder="Enter name to filter"
      />
    </div>
  );
}

export default ContactFilter;
