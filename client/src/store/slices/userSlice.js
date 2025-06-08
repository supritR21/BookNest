import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";

// Use consistent environment variable naming
const BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

// Create configured axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    fetchAllUsersRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    fetchAllUsersFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addNewAdminRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addNewAdminSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    addNewAdminFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetUserState(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const fetchAllUsers = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchAllUsersRequest());
  try {
    const response = await api.get('/v1/user/all');
    dispatch(userSlice.actions.fetchAllUsersSuccess(response.data.users));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Failed to fetch users';
    dispatch(userSlice.actions.fetchAllUsersFailed(errorMessage));
    
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }
  }
};

export const addNewAdmin = (formData) => async (dispatch) => {
  dispatch(userSlice.actions.addNewAdminRequest());
  try {
    const response = await api.post('/v1/user/add/new-admin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    dispatch(userSlice.actions.addNewAdminSuccess(response.data.message));
    toast.success(response.data.message);
    dispatch(toggleAddNewAdminPopup());
    dispatch(fetchAllUsers()); // Refresh users list
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                       'Failed to add new admin';
    
    dispatch(userSlice.actions.addNewAdminFailed(errorMessage));
    toast.error(errorMessage);
    
    if (import.meta.env.DEV) {
      console.error("Add admin error:", {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
  }
};

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;