// src/store/studentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    registerStudent(state, action) {
      const { name } = action.payload;
      if (!name?.trim()) return; // ✅ prevent empty names

      state.id =
        Date.now().toString(36) +
        Math.random().toString(36).substr(2, 5); // unique per tab
      state.name = name.trim();
    },
    resetStudent: () => ({ ...initialState }), // ✅ fresh copy
  },
});

export const { registerStudent, resetStudent } = studentSlice.actions;
export default studentSlice.reducer;
