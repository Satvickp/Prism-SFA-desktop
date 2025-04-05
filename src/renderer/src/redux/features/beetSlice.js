import { createSlice } from "@reduxjs/toolkit";

const initialBeet = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
};

export const BeetSlice = createSlice({
  name: "Beet",
  initialState: initialBeet,
  reducers: {
    setBeets: (state, action) => {
      state.content = [...action.payload.content];
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.page;
    },
    addSingleBeet: (state, action) => {
      state.content = [action.payload, ...state.content];
      state.totalElements += 1;
    },
    updateSingleBeet: (state, action) => {
      state.content = state.content.map((item) => item.id === action.payload.id ? action.payload : item);
    },
    deleteSingleBeet: (state, action) => {
      state.content = state.content.filter((item) => item.id !== action.payload);
      state.totalElements = state.totalElements - 1;
    },
    addOutletToBeet: (state, action) => {
      const { id, data } = action.payload;
      const beet = state.content.find((b) => b.id == data.beet.id);
      if (beet) {
        beet.outlets = [data, ...(beet.outlets || [])];
      }
    },
    updateOutletToBeet: (state, action) => {
      const { beetId, data } = action.payload;
      const beet = state.content.find((b) => b.id == beetId);
      if (beet) {
        beet.outlets = beet.outlets.map((item) => item.id === data.id ? data : item);
      }
    },
    removeOutletFromBeet: (state, action) => {
      const { beetId, outletId } = action.payload
      const beet = state.content.find((item) => item.id == beetId);
      if(beet){
        beet.outlets = beet.outlets.filter((item) => item.id != outletId)
      }
    }
  },
});

export const { addSingleBeet, updateSingleBeet, setBeets, addOutletToBeet, deleteSingleBeet, removeOutletFromBeet, updateOutletToBeet } = BeetSlice.actions;

export default BeetSlice.reducer;
