import createCommonOrderSlice from "./helper";

const orderBeetSlice = createCommonOrderSlice("order-beet-slice");
export default orderBeetSlice.reducer;
export const {
  paginatedOrder: dispatchBeetPaginatedOrder,
  setCommonOrder: dispatchBeetSetOrder,
  addNewOrderToTop: dispatchBeetAddOrder,
} = orderBeetSlice.actions;
