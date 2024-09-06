import React from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import { IoMdLock } from 'react-icons/io';
import styles from './Login.module.css';
import { loginUser } from '../redux/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async values => {
      const { email, password } = values;
      try {
        await dispatch(loginUser({ email, password })).unwrap();
        navigate('/HealthEN-Project');
      } catch (error) {
        console.error('Login failed:', error.message);
        alert('Login failed. Please check your credentials and try again.');
      }
    },
  });

  return (
    <div className={styles.appContainer}>
      <span className={styles.titleLogin}>
        <h2>LOG IN</h2>
      </span>

      <form onSubmit={formik.handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            <MdEmail className={styles.icon} />
            <input
              id="email"
              type="email"
              placeholder="Email"
              {...formik.getFieldProps('email')}
              className={styles.formInput}
              autoComplete="email"
            />
          </label>
          {formik.touched.email && formik.errors.email ? (
            <p className={styles.error}>{formik.errors.email}</p>
          ) : null}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>
            <IoMdLock className={styles.icon} />
            <input
              id="password"
              type="password"
              placeholder="Password"
              {...formik.getFieldProps('password')}
              className={styles.formInput}
              autoComplete="current-password"
            />
          </label>
          {formik.touched.password && formik.errors.password ? (
            <p className={styles.error}>{formik.errors.password}</p>
          ) : null}
        </div>

        <div className={styles.formGroup}>
          <div className={styles.buttonContainer}>
            <div className={styles.loginButtonContainer}>
              <button type="submit" className={styles.loginButton}>
                Log in
              </button>
            </div>

            <div>
              <button className={styles.registerButton}>
                <Link to="/register">
                  Register
                </Link>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}></div>
      </form>
    </div>
  );
};

export default LoginPage;
