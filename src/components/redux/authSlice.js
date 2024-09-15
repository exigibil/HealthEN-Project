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
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/food/users/login',
        {
          email,
          password,
        }
      );

      const { token, refreshToken, user } = response.data.data;
    
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      return { token, refreshToken, user };
    } catch (error) {
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

      const response = await axios.get(
        'http://localhost:8000/food/users/current',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('User refresh failed:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//post kcal
export const patchKcal = createAsyncThunk(
  'user/dailyKcal',
  async ({ kcal }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        'http://localhost:8000/food/users/dailyKcal',
        { kcal },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Patch daily kcal failed:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: builder => {
    builder
      // Handle user registration
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
      // Handle user login
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handle user logout
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
      // Handle user refresh
      .addCase(myUsername.pending, state => {
        state.status = 'loading';
      })
      .addCase(myUsername.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(myUsername.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle patch kcal
      .addCase(patchKcal.pending, state => {
        state.status = 'loading';
      })
      .addCase(patchKcal.fulfilled, (state, action) => {
        if (state.user) {
          state.user.dailyKcal = action.payload.dailyKcal;
        }
        state.status = 'succeeded';
      })
      .addCase(patchKcal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
