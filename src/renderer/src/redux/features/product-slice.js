import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: [],
};

export const productFeature = createSlice({
  name: "product-feature-new",
  initialState,
  reducers: {
    dispatchProductContent: (state, action) => {
      state.content = action.payload.content;
    },
  },
});

export const { dispatchProductContent } = productFeature.actions;
export default productFeature.reducer;
