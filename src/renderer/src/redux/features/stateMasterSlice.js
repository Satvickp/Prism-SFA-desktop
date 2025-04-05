import { createSlice } from '@reduxjs/toolkit'

const initialStatesMaster = {
    allStatesMaster:[],
  }
  
  export const StatesMasterSlice = createSlice({
    name : "States Master",
  
    initialState : initialStatesMaster,
  
    reducers: {
      setStatesMaster : (state, action) => {
        state.allStatesMaster = action.payload;
      },
  
      concatStatesMaster: (state, action) => {
        state.allStatesMaster = [...state.allStatesMaster , ...action.payload.allStatesMaster];
      },
  
      addStatesMaster: (state, action) => {
        state.allStatesMaster = [...action.payload, ...state.allStatesMaster]
      },
  
      deleteStatesMaster: (state,action) => {
          state.allStatesMaster = state.allStatesMaster.filter((StatesMaster) => StatesMaster.id !== action.payload.id )
      },
  
      updateStatesMaster: (state, action) => {
          state.allStatesMaster = state.allStatesMaster.map((StatesMaster) => StatesMaster.id === action.payload.id ? action.payload : StatesMaster)
      },
  
      deleteAllStatesMaster: (state, action) => {
          return initialStatesMaster; 
      }
  
    }
  })
  
  
  
  
  export const {
    setStatesMaster,
    concatStatesMaster,
    addStatesMaster,
    deleteStatesMaster,
    updateStatesMaster,
    deleteAllStatesMaster
  } = StatesMasterSlice.actions ;
  
  export default StatesMasterSlice.reducer ;