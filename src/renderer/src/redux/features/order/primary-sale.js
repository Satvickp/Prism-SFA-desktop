import createCommonOrderSlice from "./helper";

const primarySaleSlice = createCommonOrderSlice("primary-sale");

export default primarySaleSlice.reducer;
export const {
  paginatedOrder: dispatchPrimarySalePaginatedOrder,
  setCommonOrder: dispatchPrimarySaleSetOrder,
  addNewOrderToTop: dispatchPrimarySalesAddOrder,
  updateOrder: dispatchPrimarySaleUpdateOrder,
} = primarySaleSlice.actions;
