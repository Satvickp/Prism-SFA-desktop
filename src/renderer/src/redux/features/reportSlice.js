import { createSlice } from "@reduxjs/toolkit";

const initialReportData = {
    totalElements: 0,
    totalPages: 0,
    page: 0,
    content: [],
}

export const ReportSlice = createSlice(({
    name: "Report",
    initialState: initialReportData,
    reducers: {
        setReportData: (state, action) => {
            state.content = action.payload.content
            state.page = action.payload.page
            state.totalElements = action.payload.totalElements
            state.totalPages = action.payload.totalPages
        },
        clearReportData: (state, action) => {
            return initialReportData
        }
    }
}))

export const {
    clearReportData,
    setReportData
} = ReportSlice.actions;

export default ReportSlice.reducer;