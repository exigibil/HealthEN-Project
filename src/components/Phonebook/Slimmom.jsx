import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Calculator from '../Calculator/Calculator';
import Footer from '../Footer/Footer';
import { ImExit } from 'react-icons/im';
import { logoutUser } from '../redux/authSlice'; 
import styles from './Slimmom.module.css';

function Slimmom() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Preia starea utilizatorului
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Preia starea autentificării

  // Functie de logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login'); // Redirecționează la pagina de login după logout
  };

  // Funcție apelată când utilizatorul apasă pe "Start Losing Weight" în Calculator
  const handleStartLosingWeight = (calories) => {
    if (isLoggedIn) {
      // Dacă utilizatorul e logat, redirecționează către pagina Diary
      navigate('/diary');
    } else {
      // Dacă nu e logat, afișează numărul de calorii
      alert(`Caloriile necesare pe zi sunt: ${calories}`);
    }
  };

  return (
    <>
      <div className={styles.backContainer}>
        {isLoggedIn ? (
          <>
            <div className={styles.userName}>Welcome, {user.name}</div>
            <div className={styles.dash}></div>
            <div className={styles.exitContainer} onClick={handleLogout}>
              <ImExit className={styles.exitIcon} /> <span>Exit</span>
            </div>
          </>
        ) : (
          <div className={styles.userName}>Welcome, guest</div>
        )}
      </div>

      <Calculator onStartLosingWeight={handleStartLosingWeight} />
      <Footer />
    </>
  );
}

export default Slimmom;
