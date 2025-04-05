import { createSlice } from "@reduxjs/toolkit";


const initialLeaves = {
    allLeaves: [],
    paginationData: { number:0 }
}

export const Leaves = createSlice({
    name: "Leaves",
    initialState: initialLeaves,
    reducers: {
        setLeaves: (state,action) => {
            state.allLeaves = [...action.payload.allLeaves];
            state.paginationData = {...action.payload.allLeaves}
        },
        addLeaves: (state,action) => {
            state.allLeaves.push(action.payload)
        },
        updateLeaves: (state,action) => {
            state.allLeaves = state.allLeaves.map((member) => member.id === action.payload.id ? action.payload : member)
        },
        deleteLeaves: (state,action) => {
            state.allLeaves = state.allLeaves.filter((member) => member.id !== action.payload)
        },
        deleteAllLeaves: (state, action) => {
            state.allLeaves = [];
            state.paginationData = { number:0 }
        },
        concatLeaves: (state, action) => {
            state.allLeaves = [...state.allLeaves, ...action.payload.allLeaves];
            state.paginationData = {...state.paginationData, ...action.payload.paginationData}
        }
    }
})


export const {
    setLeaves,
    addLeaves,
    updateLeaves,
    deleteAllLeaves,
    deleteLeaves,
    concatLeaves
} = Leaves.actions;

export default Leaves.reducer;
