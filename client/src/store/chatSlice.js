import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showPopup: false,
  activeTab: "chat", 
  messages: [
    { id: 1, sender: "Teacher", text: "Welcome to the poll!" },
    { id: 2, sender: "Student", text: "Thank you!" },
  ],
  participants: ["Teacher"],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    togglePopup(state) {
      state.showPopup = !state.showPopup;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    addMessage(state, action) {
      const { sender, text } = action.payload;
      if (!sender || !text) return;
      state.messages.push({
        id: Date.now(),
        sender,
        text,
      });
    },
    setParticipants(state, action) {
      state.participants = action.payload;
    },
    addParticipant(state, action) {
      if (!state.participants.includes(action.payload)) {
        state.participants.push(action.payload);
      }
    },
    removeParticipant(state, action) {
      state.participants = state.participants.filter(
        (p) => p !== action.payload
      );
    },
    resetChat: () => ({ ...initialState }),
  },
});

export const {
  togglePopup,
  setActiveTab,
  addMessage,
  setParticipants,
  addParticipant,
  removeParticipant,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
