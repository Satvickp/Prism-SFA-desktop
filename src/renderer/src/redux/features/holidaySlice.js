import { createSlice } from "@reduxjs/toolkit";

const HolidayInitialStates = {
    allHoliday: [],
    paginationData: { number: 0 } 
};

export const Holiday = createSlice({
  name: "Holiday",
  initialState: HolidayInitialStates,
  reducers: {
    setHoliday: (state, action) => {
        return {
            ...state,
            paginationData: action.payload.paginationData,
            allHoliday: [...action.payload.allHoliday],
        };
    },
    
    addHoliday: (state, action) => {
        state.allHoliday.push(action.payload);
    },
    deleteHoliday: (state, action) => {
        state.allHoliday = state.allHoliday.filter((holiday) => holiday.id !== action.payload);
    },
    updateHoliday: (state, action) => {
        state.allHoliday = state.allHoliday.map((holiday) => holiday.id === action.payload.id ? action.payload : holiday );
    },
    deleteAllHoliday: (state, action) => {
        state.allHoliday = [];
    },
    concatHoliday: (state, action) => {
        state.allHoliday = [...state.allHoliday, ...action.payload.allHoliday];
        state.paginationData = {...state.paginationData,...action.payload.paginationData};
    },
  },
});

export const {
  setHoliday,
  addHoliday,
  deleteAllHoliday,
  updateHoliday,
  deleteHoliday,
  concatHoliday,
} = Holiday.actions;

export default Holiday.reducer;
