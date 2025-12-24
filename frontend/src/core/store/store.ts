import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
});

store.subscribe(() => {
  const user = store.getState().auth;
  localStorage.setItem("authenticatedAs", JSON.stringify(user));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
