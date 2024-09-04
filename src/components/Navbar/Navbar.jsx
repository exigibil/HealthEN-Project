import React from 'react';
import { Link } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import styles from './Navbar.module.css';

function Navbar({ onLogout }) {
    return (
        <div className={styles.navContainer}>
            <div className={styles.navLink}>
                <Link to="/login" onClick={onLogout}>
                    <MdLogout /> <span>Log Out</span>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;
