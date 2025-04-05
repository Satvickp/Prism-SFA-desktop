import { createSlice } from "@reduxjs/toolkit";

const initialStatus = {
    allStatus : [],
    paginationData: { number:0 }
};

export const Status = createSlice({
    name: "Status",
    initialState: initialStatus,
    reducers: {
        setStatus: (state,action) => {
            state.allStatus = [...action.payload.allStatus]
            state.paginationData = {...action.payload.paginationData}
        },
        addStatus: (state,action) => {
            state.allStatus.push(action.payload)
        },
        concatStatus: (state,action) => {
            state.allStatus = [...state.allStatus, ...action.payload.allStatus];
            state.paginationData = {...state.paginationData, ...action.payload.paginationData}
        },
        deleteStatus: (state, action) =>{
            state.allStatus = state.allStatus.filter((Status) => Status.id !== action.payload)
        },
        updateStatus: (state,action) => {
            state.allStatus = state.allStatus.map((Status) => Status.id === action.payload.id ? action.payload : Status)
        },
        deleteAllStatus: (state, action) => {
            state.allStatus = [];
            state.paginationData = { number: 0 };
        }

    }
})

export const {
    setStatus,
    addStatus,
    concatStatus,
    deleteStatus,
    updateStatus,
    deleteAllStatus
} = Status.actions;

export default Status.reducer;