import { createSlice } from '@reduxjs/toolkit'

const initialRegionMaster = {
    allRegionMaster:[]
  }
  
  export const RegionMasterSlice = createSlice({
    name : "Region Master",
  
    initialState : initialRegionMaster,
  
    reducers: {
      setRegionMaster : (state, action) => {
        state.allRegionMaster = action.payload;
      },
  
      concatRegionMaster: (state, action) => {
        state.allRegionMaster = [...state.allRegionMaster , ...action.payload];
      },
  
      addRegionsMaster: (state, action) => {
        state.allRegionMaster = [...action.payload, ...state.allRegionMaster]
      },
  
      deleteRegionsMaster: (state,action) => {
          state.allRegionMaster = state.allRegionMaster.filter((region) => region.id !== action.payload )
      },
  
      updateRegionsMaster: (state, action) => {
          state.allRegionMaster = state.allRegionMaster.map((region) => region.id === action.payload.id ? action.payload : region)
      },
  
      deleteAllRegionMaster: (state, action) => {
          return initialRegionMaster; 
      }
  
    }
  })
  
  
  
  
  export const {
    setRegionMaster,
    concatRegionMaster,
    addRegionsMaster,
    deleteRegionsMaster,
    updateRegionsMaster,
    deleteAllRegionMaster
  } = RegionMasterSlice.actions ;
  
  export default RegionMasterSlice.reducer ;