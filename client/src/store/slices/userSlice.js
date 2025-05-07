import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
  },
  reducers: {
    fetchAllUsersRequest(state) {
      state.loading = true;
    },
    fetchAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    fetchAllUsersFailed(state) {
      state.loading = false;
    },
    addNewAdminRequest(state) {
      state.loading = true;
    },
    addNewAdminSuccess(state) {
      state.loading = false;
    },
    addNewAdminFailed(state) {
      state.loading = false;
    },
  },
});

export const fetchAllUsers = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchAllUsersRequest());
  await axios
    .get("https://byteverse-nandininjas.onrender.com/api/v1/user/all", { withCredentials: true })
    .then((res) => {
      dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
    })
    .catch((err) => {
      dispatch(
        userSlice.actions.fetchAllUsersFailed(err.response.data.message)
      );
    });
};

export const addNewAdmin = (data) => async (dispatch) => {
  dispatch(userSlice.actions.addNewAdminRequest());
  await axios
    .post("https://byteverse-nandininjas.onrender.com/api/v1/user/add/new-admin", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch(userSlice.actions.addNewAdminSuccess());
      toast.success(res.data.message);
      dispatch(toggleAddNewAdminPopup());
    })
    .catch((err) => {
      userSlice.actions.addNewAdminFailed();
      toast.error(err.response.data.message);
    });
};

export default userSlice.reducer;
