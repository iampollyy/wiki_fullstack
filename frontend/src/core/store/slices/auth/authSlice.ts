import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState = {
  token: token || null,
  user: user ? JSON.parse(user) : null,
  role: user ? JSON.parse(user).role : null,
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
      state.role = user.role;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(safeUser));
      localStorage.setItem("role", user.role);
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.role = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
