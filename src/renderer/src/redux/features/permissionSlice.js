const { createSlice } = require("@reduxjs/toolkit")

const initialState={
  memberPermissions:[],
  dropdownPermission: [],
}

const PermissionSlice = createSlice({
  name:"permission",
  initialState:initialState,
  reducers:{
    setMemberPermissions:(state,action)=>{
      state.memberPermissions = action.payload
    },
    setDropdownPermission: (state, action) => {
      state.dropdownPermission = [...action.payload]
    },
    deleteAllMemberPermissions:(state,action)=>{
      state.memberPermissions =[]
    }
  }
})

export default PermissionSlice;
export const {setMemberPermissions,deleteAllMemberPermissions, setDropdownPermission} = PermissionSlice.actions