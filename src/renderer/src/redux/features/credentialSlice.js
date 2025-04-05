import { createSlice } from "@reduxjs/toolkit";

const CredentialsInitialState = {};

export const Credentials = createSlice({
  name: "Cred",
  initialState: CredentialsInitialState,
  reducers: {
    setCredentials: (state, action) => {
        return { ...action.payload, sub: action.payload.id };
        },
    deleteCredentials: (state, action) => {
          return CredentialsInitialState;
        },
    addCredentials: (state, action) => {
          return { ...state, ...action.payload };
        }
  },
});

export const {
  setCredentials,
  deleteCredentials,
  addCredentials,
} = Credentials.actions;

export default Credentials.reducer;
