import { createSlice } from "@reduxjs/toolkit";

const initialProducts = {
  content: [],
  paginationData: {
    totalElements: 0,
    totalPages: 0,
    page: 0,
  },
};

export const Products = createSlice({
  name: "Products",
  initialState: initialProducts,
  reducers: {
    setProducts: (state, action) => {
      state.content = [...action.payload.content];
      state.paginationData = {
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        page: action.payload.page,
      };
    },
    addProducts: (state, action) => {
      state.content.push(action.payload);
    },
    deleteProducts: (state, action) => {
      // state.content = state.content.filter((product) => product.id !== action.payload)
      state.content = state.content.filter(
        (product) => product.productId !== action.id
      );
    },
    updateProducts: (state, action) => {
      state.content = state.content.map((product) =>
        product.productId === action.payload.productId
          ? action.payload
          : product
      );
    },
    concatProducts: (state, action) => {
      console.log("called");
      state.content = [...state.content, ...action.payload.content];
      state.paginationData = {
        ...state.paginationData,
        ...action.payload.paginationData,
      };
    },
    deleteAllProducts: (state, action) => {
      state.content = [];
      state.paginationData = { number: 0 };
    },
  },
    name : "Products",
    initialState: initialProducts,
    reducers: {
        setProducts: (state, action) => {
            state.content = [...action.payload.content];
            state.paginationData = {
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages,
                page: action.payload.page
            };
        },
        addProducts: (state,action) => {
            // state.content.push(action.payload)
            state.content = [action.payload, ...state.content]
        },
        deleteProducts: (state, action) =>{
            // state.content = state.content.filter((product) => product.id !== action.payload)
            state.content = state.content.filter((product) => product.productId !== action.payload.id)
        },
        updateProducts: (state,action) => {
            state.content = state.content.map((product) => product.productId === action.payload.productId ? action.payload : product)
        },
        concatProducts: (state,action) => {
            state.content = [...state.content, ...action.payload.content];
            state.paginationData = {...state.paginationData, ...action.payload.paginationData};
        },
        deleteAllProducts: (state, action) => {
            state.content = [];
            state.paginationData = { number: 0 };
        }
    }
});

export const {
  setProducts,
  addProducts,
  deleteAllProducts,
  deleteProducts,
  updateProducts,
  concatProducts,
} = Products.actions;

export default Products.reducer;
