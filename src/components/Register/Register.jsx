import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/authSlice';
import { MdEmail } from 'react-icons/md';
import { IoMdLock } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import styles from './Register.module.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
      repeatPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Repeat Password is required'),
    }),
    onSubmit: async values => {
      const { username, email, password } = values;
      try {
        await dispatch(registerUser({ name: username, email, password })).unwrap();
        navigate('/login');
      } catch (error) {
        handleError(error);
      }
    },
  });


  const getPasswordStrength = password => {
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    if (password.length < 10) return 3;
    return 4;
  };

  const handlePasswordChange = e => {
    formik.handleChange(e);
    const password = e.target.value;
    setPasswordStrength(getPasswordStrength(password));
  };

  const handleRepeatPasswordChange = e => {
    formik.handleChange(e);
  };

  const renderStrengthBar = () => {
    const segments = [];
    for (let i = 1; i <= 4; i++) {
      let className = styles.strengthSegment;
      if (i <= passwordStrength) {
        className += i === 1 ? ` ${styles.veryWeak}` : 
                      i === 2 ? ` ${styles.weak}` :
                      i === 3 ? ` ${styles.medium}` : 
                                ` ${styles.strong}`;
      }
      segments.push(<div key={i} className={className}></div>);
    }
    return <div className={styles.strengthBar}>{segments}</div>;
  };

  const handleError = (error) => {
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.message || 'An error occurred';
      alert(errorMessage);
    } else {
      alert('An unknown error occurred. Please try again.');
    }
  };



  return (
    <div className={styles.boxForm}>
      <div className={styles.registerBox}>
        <div className={styles.gradient}></div>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.logoGroup}>
            <span className={styles.title}>Agenda Register</span>
          </div>

          <div className={styles.labelBox}>
            <label htmlFor="username" className={styles.label}></label>
            <div className={styles.inputBox}>
              <FaUser className={styles.userIcon} />
              <input
                id="username"
                type="text"
                placeholder="Username"
                {...formik.getFieldProps('username')}
                className={styles.inputField}
              />
            </div>
            {formik.touched.username && formik.errors.username ? (
              <p className={styles.error}>{formik.errors.username}</p>
            ) : null}
          </div>

          <div className={styles.labelBox}>
            <label htmlFor="email" className={styles.label}></label>
            <div className={styles.inputBox}>
              <MdEmail className={styles.emailIcon} />
              <input
                id="email"
                type="email"
                placeholder="E-mail"
                {...formik.getFieldProps('email')}
                className={styles.inputField}
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <p className={styles.error}>{formik.errors.email}</p>
            ) : null}
          </div>

          <div className={styles.labelBox}>
            <label htmlFor="password" className={styles.label}></label>
            <div className={styles.inputBox}>
              <IoMdLock className={styles.passwordIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...formik.getFieldProps('password')}
                onChange={handlePasswordChange}
                className={styles.inputField}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eye}
              >
                {showPassword ? (
                  <VscEyeClosed className={styles.noEyeIcon} />
                ) : (
                  <VscEye className={styles.eyeIcon} />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <p className={styles.error}>{formik.errors.password}</p>
            ) : null}
          </div>

          <div className={styles.labelBox}>
            <label htmlFor="repeatPassword" className={styles.label}></label>
            <div className={styles.inputBox}>
              <IoMdLock className={styles.passwordIcon} />
              <input
                id="repeatPassword"
                type={showRepeatPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                {...formik.getFieldProps('repeatPassword')}
                onChange={handleRepeatPasswordChange}
                className={styles.inputField}
              />
              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                className={styles.eye}
              >
                {showRepeatPassword ? (
                  <VscEyeClosed className={styles.noEyeIcon} />
                ) : (
                  <VscEye className={styles.eyeIcon} />
                )}
              </button>
            </div>
            {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
              <p className={styles.error}>{formik.errors.repeatPassword}</p>
            ) : null}
            {renderStrengthBar()}
          </div>

          <div className={styles.buttonBox}>
            <button type="submit" className={styles.registerButton}>
              Register
            </button>
            <button type="button" className={styles.loginButton}>
              <Link to="/login">Login</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
