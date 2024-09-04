import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const client = axios.create({
  baseURL: "https://connections-api.goit.global"
});

client.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  return config;
});


// User registration
export const registerUser = createAsyncThunk(
    'user/register',
    async ({ name, email, password }, thunkAPI) => {
      try {
        const response = await client.post('/users/signup', {
          name,
          email,
          password,
        });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); // Store user data
        return { token, user };
      } catch (error) {
        const errorMessage = error.response && error.response.data
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
        const response = await client.post('/users/login', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); // Store user data in local storage
        return { token, user };
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
      await client.post('/users/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Remove user data from local storage
    } catch (error) {
      console.error('Logout failed:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
  

  export const refreshUser = createAsyncThunk(
    'user/refresh',
    async (_, thunkAPI) => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await client.get('/users/current');
          return response.data;
        } catch (error) {
          console.error('User refresh failed:', error.message);
          return thunkAPI.rejectWithValue(error.message);
        }
      } else {
        return thunkAPI.rejectWithValue('No token found');
      }
    }
  );

const initialState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      logout(state) {
        state.user = null;
        state.isLoggedIn = false;
      },
    },
    extraReducers: builder => {
      builder
        .addCase(registerUser.pending, state => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.isLoggedIn = true;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(loginUser.pending, state => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.isLoggedIn = true;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(logoutUser.pending, state => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(logoutUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = null;
          state.isLoggedIn = false;
        })
        .addCase(logoutUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(refreshUser.pending, state => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(refreshUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
        })
        .addCase(refreshUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { logout } = authSlice.actions;
  export const authReducer = authSlice.reducer;