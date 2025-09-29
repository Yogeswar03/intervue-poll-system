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
      if (!name?.trim()) return; 

      state.id =
        Date.now().toString(36) +
        Math.random().toString(36).substr(2, 5); 
      state.name = name.trim();
    },
    resetStudent: () => ({ ...initialState }), 
  },
});

export const { registerStudent, resetStudent } = studentSlice.actions;
export default studentSlice.reducer;
