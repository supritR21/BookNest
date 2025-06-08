import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Use consistent environment variable naming
const BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

// Create configured axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const pyqSlice = createSlice({
  name: "pyq",
  initialState: {
    pyqs: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    fetchPYQsRequest(state) { 
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchPYQsSuccess(state, action) { 
      state.loading = false;
      state.pyqs = action.payload;
    },
    fetchPYQsFailed(state, action) { 
      state.loading = false;
      state.error = action.payload;
    },
    addPYQRequest(state) { 
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addPYQSuccess(state, action) { 
      state.loading = false;
      state.message = action.payload.message;
      toast.success(action.payload.message);
    },
    addPYQFailed(state, action) { 
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    resetPYQState(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const fetchAllPYQs = () => async (dispatch) => {
  dispatch(pyqSlice.actions.fetchPYQsRequest());
  try {
    const response = await api.get('/v1/pyq/all');
    dispatch(pyqSlice.actions.fetchPYQsSuccess(response.data.pyqs));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Failed to fetch PYQs';
    dispatch(pyqSlice.actions.fetchPYQsFailed(errorMessage));
    
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }
  }
};

export const addPYQ = (formData) => async (dispatch) => {
  dispatch(pyqSlice.actions.addPYQRequest());
  try {
    const response = await api.post('/v1/pyq/admin/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(pyqSlice.actions.addPYQSuccess(response.data));
    dispatch(fetchAllPYQs()); // Refresh the PYQs list
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                       'Failed to add PYQ';
    dispatch(pyqSlice.actions.addPYQFailed(errorMessage));
    
    if (import.meta.env.DEV) {
      console.error("Add PYQ error:", {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
  }
};

export const { resetPYQState } = pyqSlice.actions;
export default pyqSlice.reducer;