import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Use the same base URL configuration as other slices
const BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const uploadPDF = createAsyncThunk(
  "pdf/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/v1/pdf/upload', formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("PDF uploaded successfully");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         'Failed to upload PDF';
      toast.error(errorMessage);
      
      if (import.meta.env.DEV) {
        console.error("PDF upload error:", {
          error: error.message,
          response: error.response?.data,
          config: error.config
        });
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchPDFs = createAsyncThunk(
  "pdf/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/pdf/all');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         'Failed to fetch PDFs';
      
      if (error.response?.status !== 401) {
        toast.error(errorMessage);
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

const pdfSlice = createSlice({
  name: "pdf",
  initialState: { 
    pdfs: [], 
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    resetPDFState(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload PDF
      .addCase(uploadPDF.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(uploadPDF.fulfilled, (state, action) => {
        state.loading = false;
        state.pdfs.push(action.payload);
        state.message = "PDF uploaded successfully";
      })
      .addCase(uploadPDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch PDFs
      .addCase(fetchPDFs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPDFs.fulfilled, (state, action) => {
        state.loading = false;
        state.pdfs = action.payload;
      })
      .addCase(fetchPDFs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPDFState } = pdfSlice.actions;
export default pdfSlice.reducer;