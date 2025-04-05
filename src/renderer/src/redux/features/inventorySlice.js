import { createSlice } from '@reduxjs/toolkit'

const initialInventory = {
    allInventory:[],
    paginationData:{ 
      page: 0,
      totalElements : 0,
      totalPages : 0
     }
  }
  
  export const InventorySlice = createSlice({
    name : "Inventory",
  
    initialState : initialInventory,
  
    reducers: {
      setInventory : (state, action) => {
        state.allInventory = action.payload.allInventory;
        state.paginationData = action.payload.paginationData;
      },
  
      concatInventory: (state, action) => {
        state.allInventory = [...state.allInventory , ...action.payload.allInventory];
        state.paginationData = {...state.paginationData , ...action.payload.paginationData};
      },
  
      addInventory: (state, action) => {
        state.allInventory = [action.payload, ...state.allInventory]
      },
  
      deleteInventory: (state,action) => {
          state.allInventory = state.allInventory.filter((Inventory) => Inventory.inventoryId !== action.payload.inventoryId )
      },
  
      updateInventory: (state, action) => {
          state.allInventory = state.allInventory.map((Inventory) => Inventory.inventoryId === action.payload.inventoryId ? action.payload : Inventory)
      },
  
      deleteAllInventory: (state, action) => {
          return initialInventory; 
      }
  
    }
  })
  
  
  
  
  export const {
    setInventory,
    concatInventory,
    addInventory,
    deleteInventory,
    updateInventory,
    deleteAllInventory
  } = InventorySlice.actions ;
  
  export default InventorySlice.reducer ;