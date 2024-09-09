import React from 'react';
import { useSelector } from 'react-redux';
import Calculator from '../Calculator/Calculator';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import styles from './Slimmom.module.css';



function Slimmom() {

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Preia starea autentificării
  const navigate = useNavigate();

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
      <Calculator onStartLosingWeight={handleStartLosingWeight} className={styles.calculatorComponent}/>
      <Footer />
    </>
  );
}

export default Slimmom;
