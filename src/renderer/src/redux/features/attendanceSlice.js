import { createSlice } from "@reduxjs/toolkit";

const initialAttendance = {
  totalElements: 0,
  totalPages: 0,
  page: 0,
  content: [],
  myAttendance: [],
};

export const attendanceSlice = createSlice({
  name: "attendance",
  initialState: initialAttendance,
  reducers: {
    setAttendance: (state, action) => {
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.page;
      state.content = action.payload.content;
    },
    removeAllAttendance: (state, action) => {
      return initialAttendance;
    },
    removeMyAttendance: (state, action) => {
      state.myAttendance = [];
    },
    setMyAttendance: (state, action) => {
      state.myAttendance = [...action.payload];
    },
  },
});

export const {
  removeAllAttendance,
  setAttendance,
  removeMyAttendance,
  setMyAttendance,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
