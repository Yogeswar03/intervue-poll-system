import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPoll: null,
  answers: {}, 
  results: [], 
  status: "idle", 
  history: [],
  timeoutId: null,
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setPoll(state, action) {
      if (state.status === "active") return;

      const { question, options, timeLimit } = action.payload;
      if (!question?.trim() || !Array.isArray(options) || options.length === 0) {
        return;
      }
      const cleanedOptions = options
        .map((opt) => {
          if (typeof opt === "string") {
            return { text: opt.trim(), isCorrect: false };
          }
          if (opt && typeof opt.text === "string") {
            return { text: opt.text.trim(), isCorrect: !!opt.isCorrect };
          }
          return null;
        })
        .filter(Boolean);

      state.currentPoll = {
        id: action.payload.id || Date.now().toString(36),
        question: question.trim(),
        options: cleanedOptions,
        timeLimit: timeLimit || 60,
        startedAt: Date.now(),
      };

      state.results = cleanedOptions.map(() => 0);
      state.answers = {};
      state.status = "active";
    },

    submitAnswer(state, action) {
      const { clientId, optionIndex } = action.payload;
      if (state.status !== "active") return;

      if (!clientId || optionIndex < 0 || optionIndex >= state.results.length) {
        return;
      }

      const prevAnswer = state.answers[clientId];
      if (prevAnswer !== undefined) {
        state.results[prevAnswer] = Math.max(
          0,
          state.results[prevAnswer] - 1
        );
      }

      state.answers[clientId] = optionIndex;
      state.results[optionIndex] += 1;
    },

    updateResults(state, action) {
      if (Array.isArray(action.payload)) {
        state.results = action.payload;
      }
    },

    endPoll(state) {
      if (state.currentPoll) {
        const totalVotes = state.results.reduce((a, b) => a + b, 0);

        state.history.push({
          id: state.currentPoll.id,
          question: state.currentPoll.question,
          endedAt: Date.now(),
          options: state.currentPoll.options.map((opt, idx) => ({
            option: opt.text,
            isCorrect: opt.isCorrect,
            votes: state.results[idx],
            percentage: totalVotes
              ? ((state.results[idx] / totalVotes) * 100).toFixed(1)
              : 0,
          })),
        });
      }

      state.status = "ended";
      state.timeoutId = null;
    },

    setTimeoutId(state, action) {
      state.timeoutId = action.payload;
    },

    clearTimeoutId(state) {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
        state.timeoutId = null;
      }
    },

    resetPoll: () => ({ ...initialState }),
  },
});
export const selectPollPercentages = (state) => {
  const totalVotes = state.poll.results.reduce((a, b) => a + b, 0);
  return state.poll.results.map((count) =>
    totalVotes ? ((count / totalVotes) * 100).toFixed(1) : 0
  );
};

export const {
  setPoll,
  submitAnswer,
  updateResults,
  endPoll,
  resetPoll,
  setTimeoutId,
  clearTimeoutId,
} = pollSlice.actions;

export default pollSlice.reducer;
export const startPollWithTimeout = (pollData) => (dispatch) => {

  dispatch(setPoll(pollData));
  const duration = pollData.timeLimit || 60;
  const timeout = setTimeout(() => {
    dispatch(endPoll());
  }, duration * 1000);

  dispatch(setTimeoutId(timeout));
};
