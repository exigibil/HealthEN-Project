import React, { useState } from 'react';
import styles from './Contactform.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addContact } from '../redux/operations';
import { getContacts } from '../redux/selectors';

function ContactsForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
  const contacts = useSelector(getContacts);

  const handleAddContact = () => {
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in both name and phone number.');
      return;
    }

    const existingContact = contacts.find(
      contact => contact.name === name && contact.phone === phone
    );
    if (existingContact) {
      alert('Contact already exists!');
      return;
    }

    dispatch(addContact({ name, phone }));

    setName('');
    setPhone('');
    alert('Contact added successfully!');
  };

  return (
    <div className={styles.phonebookContainer}>
      <div className={styles.phonebookTitle}>
        <h2>Phonebook</h2>
      </div>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            id="name"
            className={styles.inputText}
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="number" className={styles.label}>
            Phone Number
          </label>
          <input
            id="number"
            className={styles.inputText}
            type="tel"
            name="phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <button
          onClick={handleAddContact}
          className={styles.buttonContact}
          type="button"
        >
          Add contact
        </button>
      </form>
    </div>
  );
}

export default ContactsForm;
