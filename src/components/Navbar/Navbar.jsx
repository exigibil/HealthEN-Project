import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import LogedIcon from '../Img/svg/logo_logged.svg';
import LoginIcon from '../Img/svg/logo_mobile.svg';
import { logoutUser } from '../redux/authSlice';
import { ImExit } from 'react-icons/im';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user); 
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn); 

  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login'); 
  };

  return (
    <div className={styles.navContainer}>
      {isLoggedIn ? (
        <>
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
                  <Link to="/calculator"> Calculator</Link>
                </div>
              </div>

              <div className={styles.userName}>Welcome, {user.name}</div>
              <div className={styles.dash}></div>
              <div className={styles.exitContainer} onClick={handleLogout}>
                <ImExit className={styles.exitIcon} /> <span>Exit</span>
              </div>
            </div>
          </div>
        </>
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
