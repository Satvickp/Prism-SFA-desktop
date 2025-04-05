import { createSlice } from "@reduxjs/toolkit";

const initial = [];

export const DropDownsClients = createSlice({
  name: "DropDownsClients",
  initialState: initial,
  reducers: {
    setDropDowns: (state, action) => {
      state = [...action.payload];
    },
    addDropDowns: (state, action) => {
      state.push(action.payload);
    },
    deleteDropDowns: (state, action) => {
      state = state.filter((client) => client.id !== action.payload);
    },
    updateDropDowns: (state, action) => {
      state = state.map((client) => client.id === action.payload.id ? action.payload : client);
    },
    deleteAllDropDowns: (state) => {
      state = [];
    },
    concatDropDowns: (state, action) => {
      state.push(...action.payload);
    },
  },
});

export const {
  setDropDowns,
  addDropDowns,
  deleteAllDropDowns,
  updateDropDowns,
  deleteDropDowns,
  concatDropDowns,
} = DropDownsClients.actions;

export default DropDownsClients.reducer;
