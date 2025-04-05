import { createSlice } from "@reduxjs/toolkit";

const initialCodeConfigurationMaster = {
  employeeCodeMaster: null,
  invoiceNumberMaster: null,
};

export const CodeConfigurationMasterSlice = createSlice({
  name: "Code Configuration",

  initialState: initialCodeConfigurationMaster,

  reducers: {
    setEmployeeCodeMaster: (state, action) => {
      state.employeeCodeMaster = action.payload;
    },

    addEmployeeCodeMaster: (state, action) => {
      state.employeeCodeMaster = action.payload
    },
    setInvoiceNumberMaster: (state, action) => {
      state.invoiceNumberMaster = action.payload;
    },

    addInvoiceNumberMaster: (state, action) => {
      state.invoiceNumberMaster = action.payload
    },
  },
});

export const {
  addEmployeeCodeMaster,
  setEmployeeCodeMaster,
  addInvoiceNumberMaster,
  setInvoiceNumberMaster,
} = CodeConfigurationMasterSlice.actions;

export default CodeConfigurationMasterSlice.reducer;
