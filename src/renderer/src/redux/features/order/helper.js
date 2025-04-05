import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: [],
  page: 0,
  totalPages: 1,
  totalElements: 0,
};

const createCommonOrderSlice = (sliceName, extraReducers = {}) =>
  createSlice({
    name: sliceName,
    initialState,
    reducers: {
      ...extraReducers,
      setCommonOrder: (state, action) => {
        const { content, page, totalPages, totalElements } = action.payload;
        state.content = content;
        state.page = page;
        state.totalPages = totalPages;
        state.totalElements = totalElements;
      },

      paginatedOrder: (state, action) => {
        const { content, page, totalPages, totalElements } = action.payload;
        state.content = [...state.content, ...content];
        state.page = page;
        state.totalPages = totalPages;
        state.totalElements = totalElements;
      },

      addNewOrderToTop: (state, action) => {
        const newOrder = action.payload;
        state.content = [newOrder, ...state.content];
        state.totalElements += 1;
      },

      updateOrder: (state, action) => {
        const updatedOrder = action.payload;
        const index = state.content.findIndex(
          (order) => order.orderId === updatedOrder.orderId
        );
        if (index !== -1) {
          state.content[index] = { ...state.content[index], ...updatedOrder };
        }
      },
    },
  });

export default createCommonOrderSlice;
