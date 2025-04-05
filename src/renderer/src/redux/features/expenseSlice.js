import { createSlice } from "@reduxjs/toolkit";

const initialExpense = {
  allExpenses: [],
  allMyExpenses: [],
  paginationData: { 
    totalElements: 0,
    totalPages: 0,
    page: 0
   },
};

export const Expenses = createSlice({
  name: "Expenses",
  initialState: initialExpense,
  reducers: {
    setExpenses: (state, action) => {
      state.paginationData = action.payload.paginationData;
      state.allExpenses = [...action.payload.allExpenses];
    },
    addExpenses: (state, action) => {
      state.allExpenses = [...state.allExpenses, action.payload];
    },
    deleteExpenses: (state, action) => {
      state.allExpenses = state.allExpenses.filter(
        (expense) => expense.id !== action.payload
      );
    },
    updateExpenses: (state, action) => {
      state.allExpenses = state.allExpenses.map((expense) =>
        expense.id === action.payload.id ? action.payload : expense
      );
    },
    deleteAllExpenses: (state, action) => {
      return initialExpense;
    },
    concatExpenses: (state, action) => {
      state.allExpenses = [...state.allExpenses, ...action.payload.allExpenses];
      state.paginationData = {
        ...state.paginationData,
        ...action.payload.paginationData,
      };
    },
    setAllMyExpense: (state, action) => {
      state.allMyExpenses = [...action.payload]
    },
    addMyExpense: (state, action) => {
      state.allMyExpenses = [action.payload, ...state.allMyExpenses]
    }
  },
});

export const {
  setExpenses,
  addExpenses,
  addMyExpense,
  deleteExpenses,
  setAllMyExpense,
  updateExpenses,
  deleteAllExpenses,
  concatExpenses,
} = Expenses.actions;
export default Expenses.reducer;
