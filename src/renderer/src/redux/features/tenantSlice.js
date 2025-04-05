import { createSlice } from "@reduxjs/toolkit";

const initialTenants = {
    allTenants : [],
    pageable: {},
    tenantId : null
}

export const TenantSlice = createSlice({
    name: "Tenants",
    initialState: initialTenants,
    reducers:{
        setTenants : (state, action) => {
            return action.payload
        },
        setTenantId : (state, action) => {
            state.tenantId = action.payload
        }
    }
})

export const {
    setTenants,
    setTenantId,
} = TenantSlice.actions
export default TenantSlice.reducer