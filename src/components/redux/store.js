import { configureStore } from '@reduxjs/toolkit';
import { foodReducer } from './foodSlice';
import { filterReducer } from './filterSlice';
import { authReducer } from './authSlice';

export const store = configureStore({
  reducer: {
    food: foodReducer,
    filter: filterReducer,
    auth: authReducer,
  },
});
