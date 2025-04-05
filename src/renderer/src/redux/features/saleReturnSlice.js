import { createSlice } from "@reduxjs/toolkit";

const initialReturnSale = {
    Primary: {
        content: [],
        paginationData: {
          totalElements: 0,
          totalPages: 0,
          page: 0,
        },
    },
    Secondary: {
        content: [],
        paginationData: {
          totalElements: 0,
          totalPages: 0,
          page: 0,
        },
    }
};

export const SaleReturnSlice = createSlice({
  name: "Return Sale",
  initialState: initialReturnSale,
  reducers: {
    setPrimarySaleReturn: (state, action) => {
      state.Primary.content = [...action.payload.content];
      state.Primary.paginationData = {
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        page: action.payload.page,
      };
    },
    setSecondarySaleReturn: (state, action) => {
      state.Secondary.content = [...action.payload.content];
      state.Secondary.paginationData = {
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        page: action.payload.page,
      };
    },
    addPrimarySaleReturn: (state, action) => {
      state.Primary.content = [action.payload, ...state.Primary.content]
    },
    addSecondarySaleReturn: (state, action) => {
      state.Primary.content = [action.payload, ...state.Primary.content]
    },
    deletePrimarySaleReturn: (state, action) => {
      state.Primary.content = state.Primary.content.filter(
        (sale) => sale.id !== action.payload
      );
    },
    deleteSecondarySaleReturn: (state, action) => {
      state.Secondary.content = state.Secondary.content.filter(
        (sale) => sale.id !== action.payload
      );
    },
    updatePrimarySaleReturn: (state, action) => {
      state.Primary.content = state.Primary.content.map((sale) =>
        sale.id === action.payload.id
          ? action.payload
          : sale
      );
    },
    updateSecondarySaleReturn: (state, action) => {
      state.Secondary.content = state.Secondary.content.map((sale) =>
        sale.id === action.payload.id
          ? action.payload
          : sale
      );
    },
    deleteAllSaleReturn: (state, action) => {
      return initialReturnSale
    },
    deleteAllPrimarySaleReturn: (state, action) => {
        state.Primary = initialReturnSale.Primary
    },
    deleteAllSecondarySaleReturn: (state, action) => {
        state.Secondary = initialReturnSale.Secondary
    }
  },
});

export const {
    addPrimarySaleReturn,
    addSecondarySaleReturn,
    deleteAllPrimarySaleReturn,
    deleteAllSaleReturn,
    deleteAllSecondarySaleReturn,
    deletePrimarySaleReturn,
    deleteSecondarySaleReturn,
    setPrimarySaleReturn,
    setSecondarySaleReturn,
    updatePrimarySaleReturn,
    updateSecondarySaleReturn,
} = SaleReturnSlice.actions;

export default SaleReturnSlice.reducer;
