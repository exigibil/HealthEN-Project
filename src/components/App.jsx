import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Phonebook from './Phonebook/Phonebook';
import LoginPage from './Login/Login';
import RegisterPage from './Register/Register';
import Navbar from './Navbar/Navbar';
import { logoutUser } from './redux/authSlice';
import { getIsLoggedIn } from './redux/selectors';
import styles from './Login/Login.module.css';
import Calculator from './Calculator/Calculator';

export const App = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.reload(); 
  };

  return (
    <Router>
      <div
        className={styles.appContainer}>
        <header>

            <Navbar />

        </header>
        <main className={styles.compoenentContainer}>
             
          <Routes>
            <Route path="/" element={<Navigate to={isLoggedIn ? "/goit-react-hw-08-phonebook" : "/home"} />} />
            <Route path="/home" element ={ <Calculator /> } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/goit-react-hw-08-phonebook" element={isLoggedIn ? <Phonebook /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
