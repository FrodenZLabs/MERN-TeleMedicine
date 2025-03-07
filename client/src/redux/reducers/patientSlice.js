import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allPatients: [],
  error: null,
  loading: false,
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {},
});

// eslint-disable-next-line no-empty-pattern
export const {} = patientSlice.actions;

export default patientSlice.reducer;
