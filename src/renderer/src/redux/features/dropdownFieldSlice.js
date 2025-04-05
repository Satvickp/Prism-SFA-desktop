import { createSlice } from "@reduxjs/toolkit";

const initialDropDownsField = {
  allDivision: [],
  allDesignation: [],
  allState: [],
  allCity: [],
  allRegion: [],
  allCategory: [],
  allLeaveTypes: [],
  allExpenseTypes: [],
};

export const DropDownsField = createSlice({
  name: "DropDownsField",
  initialState: initialDropDownsField,
  reducers: {
    setAllDivision: (state, action) => {
      state.allDivision = Array.isArray(action.payload) ? action.payload : Array.from(action.payload);
    },
    setAllDesignation: (state, action) => {
      state.allDesignation = Array.isArray(action.payload) ? action.payload : Array.from(action.payload);
    },
    setAllState: (state, action) => {
      state.allState = action.payload;
    },
    setAllRegion: (state, action) => {
      state.allRegion = Array.isArray(action.payload) ? action.payload : Array.from(action.payload);
    },
    setAllCity: (state, action) => {
      state.allCity = action.payload ;
    },
    setAllCategory: (state, action) => {
      state.allCategory = Array.isArray(action.payload) ? action.payload : Array.from(action.payload);
    },
    setAllLeaveTypes: (state, action) => {
      state.allLeaveTypes = Array.isArray(action.payload) ? action.payload : Array.from(action.payload);
    },
    setAllExpenseTypes: (state, action) => {
      state.allExpenseTypes = Array.isArray(action.payload) ? action.payload : Array.from(action.payload);
    },
  },
});

export const {
  setAllDivision,
  setAllDesignation,
  setAllState,
  setAllRegion,
  setAllCity,
  setAllCategory,
  setAllLeaveTypes,
  setAllExpenseTypes,
} = DropDownsField.actions;

export default DropDownsField.reducer;
