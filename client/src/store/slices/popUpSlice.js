import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settingPopup: false,
  addBookPopup: false,
  readBookPopup: false,
  recordBookPopup: false,
  returnBookPopup: false,
  addNewAdminPopup: false,
  addPYQPopup: false,
  currentPopupData: null, // Added for storing popup-specific data
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
      if (state.settingPopup) state.currentPopupData = null;
    },
    toggleAddBookPopup(state, action) {
      state.addBookPopup = !state.addBookPopup;
      state.currentPopupData = action.payload || null;
    },
    toggleReadBookPopup(state, action) {
      state.readBookPopup = !state.readBookPopup;
      state.currentPopupData = action.payload || null;
    },
    toggleRecordBookPopup(state, action) {
      state.recordBookPopup = !state.recordBookPopup;
      state.currentPopupData = action.payload || null;
    },
    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
      state.currentPopupData = null;
    },
    toggleReturnBookPopup(state, action) {
      state.returnBookPopup = !state.returnBookPopup;
      state.currentPopupData = action.payload || null;
    },
    toggleAddPYQPopup(state, action) {
      state.addPYQPopup = !state.addPYQPopup;
      state.currentPopupData = action.payload || null;
    },
    closeAllPopups(state) {
      return {
        ...initialState,
        currentPopupData: null
      };
    },
    setPopupData(state, action) {
      state.currentPopupData = action.payload;
    },
    clearPopupData(state) {
      state.currentPopupData = null;
    }
  },
});

export const {
  closeAllPopups,
  toggleAddBookPopup,
  toggleAddNewAdminPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleReturnBookPopup,
  toggleSettingPopup,
  toggleAddPYQPopup,
  setPopupData,
  clearPopupData
} = popupSlice.actions;

// Selectors
export const selectCurrentPopup = (state) => {
  const activePopup = Object.entries(state.popup)
    .find(([key, value]) => key !== 'currentPopupData' && value === true);
  
  return {
    type: activePopup ? activePopup[0] : null,
    data: state.popup.currentPopupData
  };
};

export const selectIsAnyPopupOpen = (state) => {
  return Object.entries(state.popup)
    .some(([key, value]) => key !== 'currentPopupData' && value === true);
};

export default popupSlice.reducer;