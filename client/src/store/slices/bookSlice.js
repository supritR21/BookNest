import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopup } from "./popUpSlice";
import { toast } from "react-toastify";

// Use the same base URL configuration as authSlice
const BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },
  reducers: {
    fetchBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetBookSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  try {
    const response = await api.get('/v1/book/all');
    dispatch(bookSlice.actions.fetchBooksSuccess(response.data.books));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Failed to fetch books';
    dispatch(bookSlice.actions.fetchBooksFailed(errorMessage));
    
    // Show error toast only if it's not a 401 (unauthorized)
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }
  }
};

export const addBook = (data) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());
  try {
    const response = await api.post('/v1/book/admin/add', data);
    
    dispatch(bookSlice.actions.addBookSuccess(response.data.message));
    toast.success(response.data.message);
    dispatch(toggleAddBookPopup());
    
    // Refresh the book list after successful addition
    await dispatch(fetchAllBooks());
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Failed to add book';
    
    dispatch(bookSlice.actions.addBookFailed(errorMessage));
    toast.error(errorMessage);
    
    // Development-only logging
    if (import.meta.env.DEV) {
      console.error("Add book error:", {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
  }
};

export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
};

export default bookSlice.reducer;