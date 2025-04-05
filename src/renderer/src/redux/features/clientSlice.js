import { createSlice } from "@reduxjs/toolkit";

const initialClient = {
  allClients: [],
  paginationData: { }
};

export const Clients = createSlice({
  name: "Client",
  initialState: initialClient,
  reducers: {
    setClients: (state, action) => {

      state.allClients = [...action.payload.allClients]
      state.paginationData = {...action.payload.paginationData};
    },
    addClients: (state, action) => {
      state.allClients = [action.payload, ...state.allClients];
    },
    deleteClients: (state, action) => {
      state.allClients = state.allClients.filter((client) => client.id !== action.payload);
    },
    updateClients: (state, action) => {
      state.allClients = state.allClients.map((client) =>
        client.id === action.payload.id ? action.payload : client
      );
    },
    deleteAllClients: (state, action) => {
      return initialClient;
    },
    concatClients: (state, action) => {
      state.allClients = [...state.allClients, ...action.payload.allClients];
      state.paginationData = {
        ...state.paginationData,
        ...action.payload.paginationData,
      };
    },
  },
});

export const {
  setClients,
  addClients,
  deleteAllClients,
  updateClients,
  deleteClients,
  concatClients,
} = Clients.actions;

export default Clients.reducer;
