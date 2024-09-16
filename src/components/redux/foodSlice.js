import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  diary: [],
  items: [],
  diaryEntries: [],
  isLoading: false,
  error: null,
  forbiddenFoods: [],
};

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found, authorization required');
  }
  return token;
};

export const fetchDiary = createAsyncThunk(
  'food/diary/fetchAll',
  async (_, thunkAPI) => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:8000/food/diary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDay = createAsyncThunk(
  'food/day/fetch',
  async (date, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/food/day-info?date=${date}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFood = createAsyncThunk(
  'food/fetchAll',
  async (_, thunkAPI) => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:8000/food/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchFood = createAsyncThunk(
  'food/searchAll',
  async ({ title = '', category = '' } = {}, thunkAPI) => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:8000/food/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { title, category },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addFood = createAsyncThunk(
  'food/addFood',
  async ({ name, grams, date, calories }, thunkAPI) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        'http://localhost:8000/food/add-diary',
        {
          foodItems: [
            {
              name,
              grams,
              date,
              calories,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFood = createAsyncThunk(
  'food/deleteFood',
  async (foodItemId, thunkAPI) => {
    try {
      const token = getAuthToken();
      const response = await axios.delete(
        'http://localhost:8000/food/remove-diary',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { foodItemId },
        }
      );
      return response.data.diary;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const calculatorPublic = createAsyncThunk(
  'food/calculatorPublic',
  async ({ height, age, desiredWeight, bloodType }, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/food/calculator',
        { height, age, desiredWeight, bloodType }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const calculatorPrivat = createAsyncThunk(
  'food/calculatorPrivat',
  async ({ height, age, desiredWeight, bloodType }, thunkAPI) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        'http://localhost:8000/food/private/calculator',
        { height, age, desiredWeight, bloodType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('API Error:', error); 
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch Food
      .addCase(fetchFood.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchFood.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search Food
      .addCase(searchFood.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(searchFood.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add Food
      .addCase(addFood.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items.push(action.payload);
        console.log('Add food successful:', action.payload);
      })
      .addCase(addFood.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error('Add food error:', action.payload);
      })
      // Delete Food
      .addCase(deleteFood.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.diary = action.payload; // Update the diary with the response data
      })
      .addCase(deleteFood.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Diary
      .addCase(fetchDiary.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.diaryEntries = action.payload;
      })
      .addCase(fetchDiary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Day
      .addCase(fetchDay.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDay.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchDay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // calculatorPublic
      .addCase(calculatorPublic.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(calculatorPublic.fulfilled, (state, action) => {
        state.forbiddenFoods = action.payload.forbiddenFoods || [];
      })
      .addCase(calculatorPublic.rejected, (state, action) => {
        console.error('Failed to fetch calculator data:', action.payload);
      })

      // Calculator Privat
      .addCase(calculatorPrivat.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(calculatorPrivat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.forbiddenFoods = action.payload.forbiddenFoods || [];
      })
      .addCase(calculatorPrivat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { actions: foodActions } = foodSlice;
export const foodReducer = foodSlice.reducer;
