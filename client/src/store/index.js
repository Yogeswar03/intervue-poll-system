// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import pollReducer from "./pollSlice";
import chatReducer from "./chatSlice";
import teacherReducer from "./teacherSlice";
import studentReducer from "./studentSlice";

const store = configureStore({
  reducer: {
    poll: pollReducer,
    chat: chatReducer,
    teacher: teacherReducer,
    student: studentReducer,
  },
});

export default store;
