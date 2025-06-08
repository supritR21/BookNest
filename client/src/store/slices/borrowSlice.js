import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleRecordBookPopup } from "./popUpSlice";
import { toast } from "react-toastify";

// Use the same base URL configuration as other slices
const BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [],
    message: null,
  },
  reducers: {
    // ... (keep all your existing reducers exactly the same)
    // No changes needed to the reducer definitions
  },
});

export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
  try {
    const response = await api.get('/v1/borrow/my-borrowed-books');
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksSuccess(
      response.data.borrowedBooks
    ));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Failed to fetch your borrowed books';
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksFailed(errorMessage));
    
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }
  }
};

export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
  try {
    const response = await api.get('/v1/borrow/borrowed-books-by-users');
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksSuccess(
      response.data.borrowedBooks
    ));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Failed to fetch all borrowed books';
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksFailed(errorMessage));
    
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }
  }
};

export const recordBorrowBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBookRequest());
  try {
    const response = await api.post(`/v1/borrow/record-borrow-book/${id}`, { email });
    
    dispatch(borrowSlice.actions.recordBookSuccess(response.data.message));
    toast.success(response.data.message);
    dispatch(toggleRecordBookPopup());
    
    // Refresh both book lists after successful operation
    await Promise.all([
      dispatch(fetchUserBorrowedBooks()),
      dispatch(fetchAllBorrowedBooks())
    ]);
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Failed to record book borrowing';
    
    dispatch(borrowSlice.actions.recordBookFailed(errorMessage));
    toast.error(errorMessage);
    
    if (import.meta.env.DEV) {
      console.error("Record book error:", {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
  }
};

export const returnBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
  try {
    const response = await api.put(`/v1/borrow/return-borrowed-book/${id}`, { email });
    
    dispatch(borrowSlice.actions.returnBookSuccess(response.data.message));
    toast.success(response.data.message);
    
    // Refresh both book lists after successful return
    await Promise.all([
      dispatch(fetchUserBorrowedBooks()),
      dispatch(fetchAllBorrowedBooks())
    ]);
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Failed to return book';
    
    dispatch(borrowSlice.actions.returnBookFailed(errorMessage));
    toast.error(errorMessage);
    
    if (import.meta.env.DEV) {
      console.error("Return book error:", {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
  }
};

export const resetBorrowSlice = () => (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};

export default borrowSlice.reducer;