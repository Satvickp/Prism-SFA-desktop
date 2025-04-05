import { createSlice } from "@reduxjs/toolkit";

const intialSchedule = {
  allSchedule : [],
  paginationData : { number: 0 }
} ;

export const Schedules = createSlice({
  name: "Schedules",
  initialState: intialSchedule,
  reducers: {
    setSchedules: (state, action) => {
      state.allSchedule = [...action.payload.allSchedule];
      state.paginationData = action.payload.paginationData;
    },
    addSchedules: (state, action) => {
      state.allSchedule = [action.payload, ...state.allSchedule]
    },
    updateSchedules: (state, action) => {
      // state.allSchedule = state.allSchedule.map((schedule) => schedule.id === action.payload.id ? action.payload : schedule);
      const isFound = state.allSchedule.find((item) => item.id === action.payload.id)
      if(isFound){
        state.allSchedule = state.allSchedule.filter((item) => item.id !== action.payload.id)
        state.allSchedule = [action.payload, ...state.allSchedule]
      }
    },
    deleteSchedules: (state, action) => {
      state.allSchedule = state.allSchedule.filter((schedule) => schedule.id !== action.payload);
    },
    concatSchedules: (state, action) => {
      state.allSchedule = [ ...action.payload.allSchedule, ...state.allSchedule];
      state.paginationData = {...state.paginationData, ...action.payload.paginationData}
    },
    deleteAllSchedules: (state, action) => {
      return intialSchedule;
    }
  },
});


export const {
  setSchedules,
  addSchedules,
  updateSchedules,
  deleteSchedules,
  concatSchedules,
  deleteAllSchedules
} = Schedules.actions;

export default Schedules.reducer;
