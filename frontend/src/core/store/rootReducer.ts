import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@core/store/slices/auth/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;

