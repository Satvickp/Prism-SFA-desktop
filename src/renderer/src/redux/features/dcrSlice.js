import { createSlice } from "@reduxjs/toolkit";

const initialDcr = {
  allDcr: [],

  paginationData: { number: 0 },
};

export const Dcr = createSlice({
  name: "Dcr",
  initialState: initialDcr,
  reducers: {
    setDcr: (state, action) => {
      state.allDcr = [...action.payload.allDcr];
      state.paginationData = { ...action.payload.paginationData };
    },
    addDcr: (state, action) => {
      state.allDcr.push(action.payload);
    },
    concatDcr: (state, action) => {
      state.allDcr = [...state.allDcr, ...action.payload.alldcr];
      state.paginationData = {
        ...state.paginationData,
        ...action.payload.paginationData,
      };
    },
    deleteDcr: (state, action) => {
      state.allDcr = state.allDcr.filter((dcr) => dcr.id !== action.payload);
    },
    updateDcr: (state, action) => {
      state.allDcr = state.allDcr.map((dcr) =>
        dcr.id === action.payload.id ? action.payload : dcr
      );
    },
    deleteAllDcr: (state, action) => {
      state.allDcr = [];
      state.paginationData = { number: 0 };
    },
    // filterDcr: (state, action) => {
    //     state.allDcr = state.allDcr.filter((item) => item.id === action.payload.id)
    // }
  },
});

export const { setDcr, addDcr, concatDcr, deleteDcr, updateDcr, deleteAllDcr } =
  Dcr.actions;

export default Dcr.reducer;
