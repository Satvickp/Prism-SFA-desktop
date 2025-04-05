import { createSlice } from "@reduxjs/toolkit";

const initialCityMaster = {
  allCityMaster: [],
};

export const CityMasterSlice = createSlice({
  name: "CityMaster",

  initialState: initialCityMaster,

  reducers: {
    setCitiesMaster: (state, action) => {
      state.allCityMaster = action.payload;
    },

    concatCitiesMaster: (state, action) => {
      state.allCityMaster = [
        ...state.allCityMaster,
        ...action.payload.allCityMaster,
      ];
    },

    addCitiesMaster: (state, action) => {
      state.allCityMaster = [...action.payload, ...state.allCityMaster];
    },

    deleteCitiesMaster: (state, action) => {
      state.allCityMaster = state.allCityMaster.filter(
        (CityMaster) => CityMaster.id !== action.payload
      );
    },

    updateCitiesMaster: (state, action) => {
      state.allCityMaster = state.allCityMaster.map((CityMaster) =>
        CityMaster.id === action.payload.id ? action.payload : CityMaster
      );
    },

    deleteAllCitiesMaster: (state, action) => {
      return initialCityMaster;
    },
  },
});

export const {
  setCitiesMaster,
  concatCitiesMaster,
  addCitiesMaster,
  deleteCitiesMaster,
  updateCitiesMaster,
  deleteAllCitiesMaster,
} = CityMasterSlice.actions;

export default CityMasterSlice.reducer;
