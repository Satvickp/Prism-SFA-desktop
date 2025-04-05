import { createSlice } from '@reduxjs/toolkit';

const initialDesignationMaster = {
  allDesignationMaster: [],
  currentParentId: 0,
};

const getMaxParentDesignationId = (designations) => {
  const parentIds = designations
    .map((item) => item.parentDesignationId)
    .filter((id) => id !== null);

  return parentIds.length > 0 ? Math.max(...parentIds) : 0;
};

export const DesignationMasterSlice = createSlice({
  name: 'Designation Master',
  initialState: initialDesignationMaster,
  reducers: {
    setDesignationsMaster: (state, action) => {
      state.allDesignationMaster = action.payload;
      state.currentParentId = getMaxParentDesignationId(action.payload);
    },

    concatDesignationsMaster: (state, action) => {
      state.allDesignationMaster = [...state.allDesignationMaster, ...action.payload];
    },

    addDesignationsMaster: (state, action) => {
      state.allDesignationMaster = [action.payload, ...state.allDesignationMaster];
      state.currentParentId = getMaxParentDesignationId(state.allDesignationMaster);
    },

    deleteDesignationsMaster: (state, action) => {
      state.allDesignationMaster = state.allDesignationMaster.filter(
        (designation) => designation.id !== action.payload
      );
    },

    updateDesignationsMaster: (state, action) => {
      state.allDesignationMaster = state.allDesignationMaster.map((designation) =>
        designation.id === action.payload.id ? action.payload : designation
      );
    },

    deleteAllDesignationsMaster: (state) => {
      return initialDesignationMaster;
    },
  },
});

export const {
  setDesignationsMaster,
  concatDesignationsMaster,
  addDesignationsMaster,
  deleteDesignationsMaster,
  updateDesignationsMaster,
  deleteAllDesignationsMaster,
} = DesignationMasterSlice.actions;

export default DesignationMasterSlice.reducer;
