import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Slimmom from './Slimmom/Slimmom';
import LoginPage from './Login/Login';
import RegisterPage from './Register/Register';
import Navbar from './Navbar/Navbar';
import Calculator from './Calculator/Calculator';
import CalculatorPriv from './PrivateCalculator/CalculatorPriv';
import Diary from './Diary/Diary'; 
import { logoutUser } from './redux/authSlice'; 
import { getIsLoggedIn } from './redux/selectors'; 
import styles from './Login/Login.module.css';

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
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={isLoggedIn ? <Navigate to="/private-calc" /> : <Calculator />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/diary" element={isLoggedIn ? <Diary /> : <Navigate to="/login" />} />
            <Route path="/private-calc" element={isLoggedIn ? <CalculatorPriv /> : <Navigate to="/home" />} />
            <Route path="/HealthEN-Project" element={isLoggedIn ? <Slimmom /> : <Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
