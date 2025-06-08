const BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    // ... (keep all your existing reducers exactly the same)
    // No changes needed to the reducer definitions
  },
});

// Action creators with improved error handling
export const register = (data) => async (dispatch) => {
  dispatch(authSlice.actions.registerRequest());
  try {
    const response = await api.post('/v1/auth/register', data);
    dispatch(authSlice.actions.registerSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Registration failed';
    dispatch(authSlice.actions.registerFailed(errorMessage));
  }
};

export const otpVerification = (email, otp) => async (dispatch) => {
  dispatch(authSlice.actions.otpVerificationRequest());
  try {
    const response = await api.post('/v1/auth/verify-otp', { email, otp });
    dispatch(authSlice.actions.otpVerificationSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'OTP verification failed';
    dispatch(authSlice.actions.otpVerificationFailed(errorMessage));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  try {
    const response = await api.post('/v1/auth/login', data);
    dispatch(authSlice.actions.loginSuccess(response.data));
  } catch (error) {
    let errorMessage = "Login failed";
    
    if (error.code === 'ERR_NETWORK') {
      errorMessage = "Network error - please check your connection";
    } else if (error.response) {
      errorMessage = error.response.data?.message || 
                   `Error: ${error.response.status}`;
    }
    
    dispatch(authSlice.actions.loginFailed(errorMessage));
    
    // Development-only logging
    if (import.meta.env.DEV) {
      console.error("Login error details:", {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
    }
  }
};

export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  try {
    const response = await api.get('/v1/auth/logout');
    dispatch(authSlice.actions.logoutSuccess(response.data.message));
    dispatch(authSlice.actions.resetAuthSlice());
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Logout failed';
    dispatch(authSlice.actions.logoutFailed(errorMessage));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  try {
    const response = await api.get('/v1/auth/me');
    dispatch(authSlice.actions.getUserSuccess(response.data));
  } catch (error) {
    dispatch(authSlice.actions.getUserFailed());
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(authSlice.actions.forgotPasswordRequest());
  try {
    const response = await api.post('/v1/auth/password/forgot', { email });
    dispatch(authSlice.actions.forgotPasswordSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Password reset request failed';
    dispatch(authSlice.actions.forgotPasswordFailed(errorMessage));
  }
};

export const resetPassword = (data, token) => async (dispatch) => {
  dispatch(authSlice.actions.resetPasswordRequest());
  try {
    const response = await api.put(`/v1/auth/password/reset/${token}`, data);
    dispatch(authSlice.actions.resetPasswordSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Password reset failed';
    dispatch(authSlice.actions.resetPasswordFailed(errorMessage));
  }
};

export const updatePassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());
  try {
    const response = await api.put('/v1/auth/password/update', data);
    dispatch(authSlice.actions.updatePasswordSuccess(response.data.message));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        'Password update failed';
    dispatch(authSlice.actions.updatePasswordFailed(errorMessage));
  }
};

// Keep all other exports the same
export const { resetAuthSlice } = authSlice.actions;
export default authSlice.reducer;