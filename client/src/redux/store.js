import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authenticationReducer from "./reducers/authenticationSlice";
import patientReducer from "./reducers/patientSlice";

const rootReducer = combineReducers({
  patients: patientReducer,
  // doctor: doctorReducer,
  // appointments: appointmentReducer,
  // prescription: prescriptionReducer,
  authentication: authenticationReducer,
  // video: videoReducer,
  // notification: notificationReducer,
  // payment: paymentReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
