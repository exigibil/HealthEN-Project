import styles from './Footer.module.css';

function Footer() {
    return (
        <div className={styles.diaryContainer}>

        <div className={styles.dayDiary}>
          <span>Summary for 13.08.2023 </span>
        </div>

        <ul className={styles.dayStats}>
          <li> Left</li>
          <li> Consumed</li>
          <li> Daily</li>
          <li> n% of normal</li>
        </ul>

        <div className={styles.foodNot}>
          <span>Food not recommended</span>


          <div>
            <span className={styles.dietNot}>Your diet will be displayed here</span>
          </div>
        </div>

      </div>
    );
}

export default Footer;