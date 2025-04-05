import createCommonOrderSlice from "./helper";

const secondarySalesSlice = createCommonOrderSlice("secondary-sale");

export default secondarySalesSlice.reducer;
export const {
  paginatedOrder: dispatchSecondarySalePaginatedOrder,
  setCommonOrder: dispatchSecondarySaleSetOrder,
  addNewOrderToTop: dispatchSecondarySalesAddOrder,
  updateOrder: dispatchSecondarySalesUpdateOrder,
} = secondarySalesSlice.actions;
