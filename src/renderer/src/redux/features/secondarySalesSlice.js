import { createSlice } from '@reduxjs/toolkit';

const initialSecondarySales = {
  allSecondarySales: [],
  paginationData: { number: 0 },
};

export const SecondarySales = createSlice({
  name: 'SecondarySales',

  initialState: initialSecondarySales,

  reducers: {
    setSecondarySales: (state, action) => {
      state.allSecondarySales = [...action.payload.allSecondarySales];
      state.paginationData = action.payload.paginationData;
    },

    concatSecondarySales: (state, action) => {
      state.allSecondarySales = [...state.allSecondarySales, ...action.payload.allSecondarySales];
      state.paginationData = { ...state.paginationData, ...action.payload.paginationData };
    },

    addSecondarySale: (state, action) => {
      state.allSecondarySales.push(action.payload);
    },

    deleteSecondarySale: (state, action) => {
      state.allSecondarySales = state.allSecondarySales.filter(
        (secondarySale) => secondarySale.id !== action.payload
      );
    },

    updateSecondarySale: (state, action) => {
      state.allSecondarySales = state.allSecondarySales.map((secondarySale) =>
        secondarySale.id === action.payload.id ? action.payload : secondarySale
      );
    },

    deleteAllSecondarySales: (state) => {
      state.allSecondarySales = [];
      state.paginationData = { number: 0 };
    },
  },
});


export const {
  setSecondarySales,
  concatSecondarySales,
  addSecondarySale,
  deleteSecondarySale,
  updateSecondarySale,
  deleteAllSecondarySales,
} = SecondarySales.actions;

// Export reducer
export default SecondarySales.reducer;
