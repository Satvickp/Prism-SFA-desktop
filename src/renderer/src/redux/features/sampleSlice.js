import { createSlice } from "@reduxjs/toolkit";

const initialSample = {
  allSample: [],
  paginationData: { number: 0 },
};

export const Samples = createSlice({
  name: "Samples",
  initialState: initialSample,
  reducers: {
    setAllSample: (state, action) => {
      state.allSample = [...action.payload.allSample];
      state.paginationData = action.payload.paginationData;
    },
    addSample: (state, action) => {
      state.allSample = [action.payload, ...state.allSample];
    },
    deleteSample: (state, action) => {
      state.allSample = state.allSample.filter(
        (sample) => sample.id !== action.payload.id
      );
    },
    updateSample: (state, action) => {
      console.log("Action Payload:", action.payload);
      console.log("Before Update:", state.allSample);
      state.allSample = state.allSample.map((sample) =>
        sample.id === action.payload.id ? action.payload : sample
      );
      console.log("After Update:", state.allSample);
    },
  },
});

export const { setAllSample, addSample, deleteSample, updateSample } =
  Samples.actions;
export default Samples.reducer;
