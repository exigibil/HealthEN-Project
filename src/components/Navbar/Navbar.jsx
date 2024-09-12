import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import LogedIcon from '../Img/svg/logo_logged.svg';
import LoginIcon from '../Img/svg/logo_mobile.svg';
import { ImExit } from 'react-icons/im';
import { getIsLoggedIn } from '../redux/selectors'; // Verifică dacă utilizatorul este autentificat
import { myUsername } from '../redux/authSlice'; // Importă thunk-ul

function Navbar({ onLogout }) {
  const [username, setUsername] = useState(null);
  const isLoggedIn = useSelector(getIsLoggedIn); // Verifică dacă utilizatorul este autentificat
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUsername = async () => {
        try {
          const resultAction = await dispatch(myUsername());
          if (myUsername.fulfilled.match(resultAction)) {
            setUsername(resultAction.payload.username); // Setează username-ul în starea componentului
          } else {
            console.error('Failed to fetch username:', resultAction.payload);
          }
        } catch (error) {
          console.error('Failed to fetch username:', error);
        }
      };

      fetchUsername();
    } else {
      setUsername(null); // Resetează username-ul dacă utilizatorul nu este autentificat
    }
  }, [dispatch, isLoggedIn]);

  return (
    <div className={styles.navContainer}>
      {isLoggedIn ? (
        <div className={styles.loginNav}>
          <div className={styles.logo}>
            <Link to="/diary">
              <img src={LogedIcon} alt="Logged In" className={styles.icon} />
            </Link>
          </div>
          <div className={styles.backContainer}>
            <div className={styles.linkContainer}>
              <div className={styles.links}>
                <Link to="/diary">Diary</Link>
              </div>
              <div className={styles.links}>
                <Link to="/calculator">Calculator</Link>
              </div>
            </div>
            <div className={styles.userName}>
              Welcome, {username || 'User'} {/* Afișează username-ul */}
            </div>
            <div className={styles.dash}></div>
            <div className={styles.exitContainer} onClick={onLogout}>
              <ImExit className={styles.exitIcon} /> <span>Exit</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.logo}>
            <Link to="/home">
              <img src={LoginIcon} alt="Login" className={styles.icon} />
            </Link>
          </div>
          <div className={styles.navLink}>
            <Link to="/login">
              <span>LOG IN</span>
            </Link>
            <Link to="/register">
              <span>REGISTRATION</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;
