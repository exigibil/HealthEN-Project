import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, deleteContact } from '../redux/operations';
import ContactsForm from '../ContactsForm/Contactform';
import ContactFilter from '../Filtering/Filter';
import {
  getContacts,
  getIsLoading,
  getError,
  getFilter,
} from '../redux/selectors';
import styles from './Phonebook.module.css';

function Phonebook() {
  const dispatch = useDispatch();
  const contacts = useSelector(getContacts);
  const isLoading = useSelector(getIsLoading);
  const error = useSelector(getError);
  const filter = useSelector(getFilter);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleRemoveContact = async contactId => {
    try {
      await dispatch(deleteContact(contactId));
      dispatch(fetchContacts());
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
    
      <ContactsForm />

      <div className={styles.phonebookContainer}>
        <div className={styles.title}>
          <h2>Contacts List</h2>
          <ContactFilter />
        </div>

        <ul className={styles.phonebookList}>
          {filteredContacts.map((contact, index) => (
            <li key={contact.id}>
              <div className={styles.ContactContainer}>
                <div className={styles.ListContainer}>
                  <div className={styles.CheckBox}>
                    <input type="checkbox" />
                  </div>

                  <div className={styles.ContactList}>
                    {index + 1}. {contact.name} : {contact.phone}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  type="button"
                  className={styles.buttonContact}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Phonebook;
