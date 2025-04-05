import { createSlice } from "@reduxjs/toolkit";

const initialMembers = {
  allMembers: [],
  paginationData: { number: 0 },
  dropdownMembers: [],
};

export const Members = createSlice({
  name: "Member",
  initialState: initialMembers,
  reducers: {
    setMembers: (state, action) => {
      state.paginationData = action.payload.paginationData;
      state.allMembers = [...action.payload.allMembers];
    },
    setDropdownMembers: (state, action) => {
      state.dropdownMembers = [...action.payload];
    },
    addMembers: (state, action) => {
      state.allMembers = [action.payload, ...state.allMembers];
    },
    deleteMembers: (state, action) => {
      state.allMembers = state.allMembers.filter(
        (member) => member.id !== action.payload
      );
    },
    updateMembers: (state, action) => {
      state.allMembers = state.allMembers.map((member) =>
        member.id === action.payload.id ? action.payload : member
      );
    },
    updateMemberPermission: (state, action) => {
      state.allMembers = state.allMembers.map((item) =>
        item.id === action.payload.memberId
          ? { ...item, userRoleList: action.payload.userRoleList }
          : item
      );
    },
    deleteAllMembers: (state, action) => {
      return initialMembers;
    },
    concatMembers: (state, action) => {
      state.allMembers = [...state.allMembers, ...action.payload.allMembers];
      state.paginationData = {
        ...state.paginationData,
        ...action.payload.paginationData,
      };
    },
  },
});

export const {
  setMembers,
  addMembers,
  deleteAllMembers,
  updateMembers,
  deleteMembers,
  updateMemberPermission,
  concatMembers,
  setDropdownMembers,
} = Members.actions;

export default Members.reducer;
