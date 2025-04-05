import { createSlice } from '@reduxjs/toolkit'

const initialOutlets = {
    allOutlets:[]
  }
  
  export const OutletSlice = createSlice({
    name : "Outlets",
  
    initialState : initialOutlets,
  
    reducers: {
      dispatchSetOutlets : (state, action) => {
        state.allOutlets = action.payload;
      },
  
      dispatchConcatOutlets: (state, action) => {
        state.allOutlets = [...state.allOutlets , ...action.payload];
      },
  
      dispatchAddOutlet: (state, action) => {
        state.allOutlets = [action.payload, ...state.allOutlets]
      },
  
      dispatchDeleteOutlet: (state,action) => {
          state.allOutlets = state.allOutlets.filter((item) => item.id !== action.payload )
      },
  
      dispatchUpdateOutlet: (state, action) => {
          state.allOutlets = state.allOutlets.map((item) => item.id === action.payload.id ? action.payload : item)
      },
  
      dispatchDeleteAllOutlet: (state, action) => {
          return initialOutlets; 
      }
  
    }
  })
  
  
  
  
  export const {
    dispatchAddOutlet,
    dispatchConcatOutlets,
    dispatchDeleteAllOutlet,
    dispatchDeleteOutlet,
    dispatchSetOutlets,
    dispatchUpdateOutlet,
  } = OutletSlice.actions ;
  
  export default OutletSlice.reducer ;