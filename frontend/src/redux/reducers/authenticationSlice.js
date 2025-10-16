import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  globalLoading: false,
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
      state.globalLoading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.globalLoading = false;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    setGlobalLoading(state, action) {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  signoutSuccess,
  setGlobalLoading,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
