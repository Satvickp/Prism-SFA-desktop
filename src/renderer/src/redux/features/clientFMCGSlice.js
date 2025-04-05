import { createSlice } from "@reduxjs/toolkit";

const initialClientFMCG = {
  allClients: [],
  paginationData: {},
  allDoctors: [],
  doctorsAvailibity: [],
  selectedBeet: null,
};

export const ClientFMCG = createSlice({
  name: "ClientFMCG",
  initialState: initialClientFMCG,
  reducers: {
    setSelectedBeet: (state, action)=> {
      state.selectedBeet = action.payload
    },
    resetSelectedBeet: (state, action)=> {
      state.selectedBeet = null
    },
    setClientsFMCG: (state, action) => {
      state.allClients = [...action.payload.allClients];
      state.paginationData = { ...action.payload.paginationData };
    },
    addClientsFMCG: (state, action) => {
      state.allClients = [action.payload, ...state.allClients];
    },
    deleteClientsFMCG: (state, action) => {
      state.allClients = state.allClients.filter(
        (client) => client.id !== action.payload
      );
    },
    updateClientsFMCG: (state, action) => {
      state.allClients = state.allClients.map((client) =>
        client.id === action.payload.id ? action.payload : client
      );
    },
    deleteAllClientsFMCG: (state, action) => {
      return initialClientFMCG;
    },
    //all doctors state
    setAllDoctors: (state, action) => {
      state.allDoctors = [...action.payload.allDoctors];
      state.paginationData = { ...action.payload.paginationData };
    },
    //add doctors
    addDoctorsData: (state, action) => {
      state.allDoctors = [action.payload, ...state.allDoctors];
    },
    //update doctors slice
    updateDoctorsData: (state, action) => {
      state.allDoctors = state.allDoctors.map((doctor) =>
        doctor?.id === action?.payload?.id ? action.payload : doctor
      );
    },
    //update doctors availability slice
    updateDoctorAvailabilityData: (state, action) => {
      state.allDoctors = state.allDoctors.map((doctor) =>
        doctor?.id === action?.payload?.id ? action.payload : doctor
      );
    },
    //doctors availibity
    doctorsAvailibity: (state, action) => {
      state.doctorsAvailibity = [...action.payload.doctorsAvailibity];
    },
    deleteDoctor: (state, action) => {
      state.allDoctors = state.allDoctors.filter((item) => item.id !== action.payload);
    },

    concatClientsFMCG: (state, action) => {
      state.allClients = [...state.allClients, ...action.payload.allClients];
      state.paginationData = {
        ...state.paginationData,
        ...action.payload.paginationData,
      };
    },
  },
});

export const {
  addClientsFMCG,
  concatClientsFMCG,
  deleteAllClientsFMCG,
  deleteClientsFMCG,
  setClientsFMCG,
  updateClientsFMCG,
  //doctors api data
  setAllDoctors,
  updateDoctorsData,
  deleteDoctor,
  addDoctorsData,
  setSelectedBeet,
  resetSelectedBeet
} = ClientFMCG.actions;

export default ClientFMCG.reducer;
