import { createSlice } from "@reduxjs/toolkit";

const initialLeaveRequest = {
  allLeaveRequests: [],
  paginationData: { number: 0 },
  allMyLeaveRequest: [],
};

export const LeaveRequests = createSlice({
  name: "LeaveRequests",
  initialState: initialLeaveRequest,
  reducers: {
    setLeaveRequests: (state, action) => {
      state.allLeaveRequests = [...action.payload.allLeaveRequests];
      state.paginationData = action.payload.paginationData;
    },
    addLeaveRequests: (state, action) => {
      state.allLeaveRequests.push(action.payload);
    },
    deleteLeaveRequests: (state, action) => {
      state.allMyLeaveRequest = state.allMyLeaveRequest.filter(
        (member) => member.id !== action.payload
      );
    },
    updateLeaveRequests: (state, action) => {
      state.allLeaveRequests = state.allLeaveRequests.map((leave) =>
        leave.id === action.payload.id ? action.payload : leave
      );
    },
    updateMyLeaveRequests: (state, action) => {
      state.allMyLeaveRequest = state.allMyLeaveRequest.map((leave) =>
        leave.id === action.payload.id ? action.payload : leave
      );
    },
    deleteAllLeaveRequests: (state, action) => {
      state.allLeaveRequests = [];
      state.paginationData = { number: 0 };
    },
    concatLeaveRequests: (state, action) => {
      state.allLeaveRequests = [
        ...state.allLeaveRequests,
        ...action.payload.allLeaveRequests,
      ];
      state.paginationData = {
        ...state.paginationData,
        ...action.payload.paginationData,
      };
    },
    setAllMyLeaveRequest: (state, action) => {
      state.allMyLeaveRequest = action.payload;
    },
    addMyLeaveRequest: (state, action) => {
      state.allMyLeaveRequest = [action.payload, ...state.allMyLeaveRequest];
    },
  },
});

export const {
  setLeaveRequests,
  addMyLeaveRequest,
  addLeaveRequests,
  deleteAllLeaveRequests,
  updateLeaveRequests,
  deleteLeaveRequests,
  concatLeaveRequests,
  setAllMyLeaveRequest,
  updateMyLeaveRequests
} = LeaveRequests.actions;

export default LeaveRequests.reducer;
