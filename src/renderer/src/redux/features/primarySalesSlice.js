import { createSlice } from '@reduxjs/toolkit'

const initialPrimarySales = {
    allPrimarySales:[],
    paginationData:{ 
      page: 0,
      totalElements : 0,
      totalPages : 0
     }
  }
  
  export const PrimarySales = createSlice({
    name : "PrimarySales",
  
    initialState : initialPrimarySales,
  
    reducers: {
      setPrimarySale : (state, action) => {
        state.allPrimarySales = action.payload.allPrimarySales;
        state.paginationData = action.payload.paginationData;
      },
  
      concatPrimarySale: (state, action) => {
        state.allPrimarySales = [...state.allPrimarySales , ...action.payload.allPrimarySales];
        state.paginationData = {...state.paginationData , ...action.payload.paginationData};
      },
  
      addPrimarySale: (state, action) => {
        state.allPrimarySales = [action.payload, ...state.allPrimarySales]
      },
  
      deletePrimarySale: (state,action) => {
          state.allPrimarySales = state.allPrimarySales.filter((primarySales) => primarySales.inventoryId !== action.payload.inventoryId )
      },
  
      updatePrimarySale: (state, action) => {
          state.allPrimarySales = state.allPrimarySales.map((primarySales) => primarySales.inventoryId === action.payload.inventoryId ? action.payload : primarySales)
      },
  
      deleteAllPrimarySale: (state, action) => {
          return initialPrimarySales; 
      }
  
    }
  })
  
  
  
  
  export const {
    setPrimarySale,
    concatPrimarySale,
    addPrimarySale,
    deletePrimarySale,
    updatePrimarySale,
    deleteAllPrimarySale
  } = PrimarySales.actions ;
  
  export default PrimarySales.reducer ;