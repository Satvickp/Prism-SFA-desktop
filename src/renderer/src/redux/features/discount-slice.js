import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allDiscount: [],
};

export const DiscountSlice = createSlice({
  name: "Discount",
  initialState,
  reducers: {
    dispatchSetDiscount: (state, action) => {
      state.allDiscount = action.payload;
    },
    dispatchAddDiscount: (state, action) => {
      state.allDiscount = [action.payload, ...state.allDiscount];
    },
    dispatchUpdateDiscount: (state, action) => {
      state.allDiscount = state.allDiscount.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    dispatchDeleteDiscount: (state, action) => {
      state.allDiscount = state.allDiscount.filter(
        (item) => item.id !== action.payload
      );
    },
    dispatchRemoveAllDiscount: (state, action) => {
      return initialState;
    },
  },
});

export const {
  dispatchAddDiscount,
  dispatchDeleteDiscount,
  dispatchRemoveAllDiscount,
  dispatchSetDiscount,
  dispatchUpdateDiscount,
} = DiscountSlice.actions;
export default DiscountSlice.reducer;
