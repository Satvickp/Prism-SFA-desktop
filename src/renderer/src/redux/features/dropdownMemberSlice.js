import { createSlice } from "@reduxjs/toolkit";

const initialDropDownMembers = [];

export const DropDownMembers = createSlice({
  name: "DropDownMembers",
  initialState: initialDropDownMembers,
  reducers: {
    setDropDownMembers: (state, action) => {
      state.splice(0, state.length, ...action.payload);
    },
    addDropDownMembers: (state, action) => {
      state.push(action.payload);
    },
    deleteDropDownMembers: (state, action) => {
      state = state.filter((member) => member.id !== action.payload);
    },
    updateDropDownMembers: (state, action) => {
      state = state.map((member) =>
        member.id === action.payload.id ? action.payload : member
      );
    },
    deleteAllDropDownMembers: (state) => {
      state.splice(0, state.length);
    },
    concatDropDownMembers: (state, action) => {
      state.push(...action.payload);
    },
  },
});

export const {
  setDropDownMembers,
  addDropDownMembers,
  deleteAllDropDownMembers,
  updateDropDownMembers,
  deleteDropDownMembers,
  concatDropDownMembers,
} = DropDownMembers.actions;

export default DropDownMembers.reducer;
