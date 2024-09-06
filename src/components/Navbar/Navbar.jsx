import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import LogedIcon from '../Img/svg/logo_logged.svg';
import LoginIcon from '../Img/svg/logo_mobile.svg';

function Navbar({ isLoggedIn, onLogout }) {
    return (
        <div className={styles.navContainer}>
            {isLoggedIn ? (
                <>
                    <div className={styles.logo}>
                        <Link to="/diary">
                            <img src={LogedIcon} alt="Logged In" className={styles.icon} />
                        </Link>
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
