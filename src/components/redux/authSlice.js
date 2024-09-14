import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  status: 'idle',
  error: null,
};

// User registration
export const registerUser = createAsyncThunk(
  'user/register',
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/food/users/register',
        {
          username,
          email,
          password,
        }
      );
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      console.error('Registration failed:', errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// User login

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/food/users/login',
        { email, password }
      );
      
      const { token, refreshToken, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      return { token, refreshToken, user };
    } catch (error) {
      console.error('Login failed:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// User logout
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await axios.post('http://localhost:8000/food/users/logout');
      return;
    } catch (error) {
      console.error('Logout failed:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Get userName
export const myUsername = createAsyncThunk(
  'user/refresh',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:8000/food/users/current', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('User refresh failed:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user; 
        state.isLoggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, state => {
        state.status = 'succeeded';
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(myUsername.pending, state => {
        state.status = 'loading';
      })
      .addCase(myUsername.fulfilled, (state, action) => {
        state.user = action.payload; // Store user data
        state.isLoggedIn = true;
      })
      .addCase(myUsername.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
