import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  question: "",
  options: [],
  timeLimit: 60,
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    setPollData(state, action) {
      const { question, options, timeLimit } = action.payload;

      state.question = typeof question === "string" ? question.trim() : "";

      state.options = Array.isArray(options)
        ? options.filter((o) => o?.text?.trim())
        : [];

      state.timeLimit =
        typeof timeLimit === "number" && timeLimit > 0 ? timeLimit : 60;
    },
    resetPoll: () => ({ ...initialState }), 
  },
});

export const { setPollData, resetPoll } = teacherSlice.actions;
export default teacherSlice.reducer;
