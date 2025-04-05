import { createSlice } from '@reduxjs/toolkit'

const initialOrder = {
    allOrder:[],
    paginationData:{ 
      page: 0,
      totalElements : 0,
      totalPages : 0
     }
  }
  
  export const OrderSlice = createSlice({
    name : "Order",
  
    initialState : initialOrder,
  
    reducers: {
      setOrder : (state, action) => {
        state.allOrder = action.payload.allOrder;
        state.paginationData = action.payload.paginationData;
      },
  
      concatOrder: (state, action) => {
        state.allOrder = [...state.allOrder , ...action.payload.allOrder];
        state.paginationData = {...state.paginationData , ...action.payload.paginationData};
      },
  
      addOrder: (state, action) => {
        state.allOrder = [action.payload, ...state.allOrder]
      },
  
      deleteOrder: (state,action) => {
          state.allOrder = state.allOrder.filter((order) => order.id !== action.payload.id )
      },
  
      updateOrder: (state, action) => {
          state.allOrder = state.allOrder.map((order) => order.id === action.payload.id ? action.payload : order)
      },
  
      deleteAllOrder: (state, action) => {
          return initialOrder; 
      }
  
    }
  })
  
  
  
  
  export const {
    setOrder,
    concatOrder,
    addOrder,
    deleteAllOrder,
    updateOrder,
    deleteOrder
  } = OrderSlice.actions ;
  
  export default OrderSlice.reducer ;