import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Slimmom from './Phonebook/Slimmom';
import LoginPage from './Login/Login';
import RegisterPage from './Register/Register';
import Navbar from './Navbar/Navbar';
import { getIsLoggedIn } from './redux/selectors';
import styles from './Login/Login.module.css';
import Calculator from './Calculator/Calculator';
import Diary from './Diary/Diary'; 
import { logoutUser } from './redux/authSlice'; 

export const App = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.reload(); 
  };
  


  return (
    <Router>
      <div className={styles.appContainer}>
        <header>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        </header>
        <main className={styles.componentContainer}>
          <Routes>
            <Route path="/" element={<Navigate to={isLoggedIn ? "/Healthen-Project" : "/home"} />} />
            <Route path="/home" element={<Calculator />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/diary" element={isLoggedIn ? <Diary /> : <Navigate to="/login" />} />
            <Route path="/HealthEN-Project" element={isLoggedIn ? <Slimmom /> : <Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
