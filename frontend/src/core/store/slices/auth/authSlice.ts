import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState = {
  token: token || null,
  user: user ? JSON.parse(user) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { token, user } = action.payload;
      const { passwordHash, ...safeUser } = user;

      state.token = token;
      state.user = user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(safeUser));
    },

    logout(state) {
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
