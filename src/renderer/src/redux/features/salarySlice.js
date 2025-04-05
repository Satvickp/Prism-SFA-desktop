import { createSlice } from "@reduxjs/toolkit";

const initialSalary = {
    allSalary : [],
    paginationData: { number:0 }
}

export const salarySlice = createSlice({
    name : 'Salary',
    initialState: initialSalary,
    reducers: {
        setSalary : (state, action) => {
            state.allSalary = [...action.payload.allSalary];
            state.paginationData = action.payload.paginationData;
        },
        addSalary : (state, action) => {
            state.allSalary.push(action.payload)
        },
        concatSalary : (state,action) => {
            state.allSalary = [...state.allSalary, ...action.payload.allSalary];
            state.paginationData = {...state.paginationData, ...action.payload.paginationData};
        },
        deleteSalary : (state,action) => {
            state.allSalary = state.allSalary.filter((salary) => salary.id !== action.payload)
        },
        updateSalary : (state, action) => {
            state.allSalary = state.allSalary.map((salary) => salary.id === action.payload.id ? action.payload : salary)
        }
    }
})

export const {
    setSalary,
    addSalary,
    concatSalary,
    deleteSalary,
    updateSalary
} = salarySlice.actions;

export default salarySlice.reducer