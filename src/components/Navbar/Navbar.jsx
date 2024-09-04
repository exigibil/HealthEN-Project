import React from 'react';
import { Link } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import styles from './Navbar.module.css';
import LoginIcon from '../Img/svg/logo_mobile.svg'


function Navbar({ isLoggedIn, userName, onLogout }) {
    return (
        <div className={styles.navContainer}>
           
            <div className={styles.logo}> 
                <img src={LoginIcon} alt="Login" className={styles.icon} />
            </div>

            {isLoggedIn ? (
                <div className={styles.navLink}>
                    <span>Welcome, {userName}</span>
                    <Link to="/login" onClick={onLogout}>
                    <MdLogout /> 
                    <span>Log Out</span>
                    </Link>
                </div>
            ) : (
                <div className={styles.navLink}>
                    <Link to="/login">
                   
                        <span>LOG IN</span>
                    </Link>
                    <Link to="/register">
                        
                        <span>REGISTRATION</span>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Navbar;