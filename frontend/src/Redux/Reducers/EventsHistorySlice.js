import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  history: null,
};

export const eventsHistorySlice = createSlice({
  name: "eventsHistory",
  initialState,
  reducers: {
    addToHistory: (state, action) => {
      if (state.history === null) state.history = [...action.payload];
      else state.history.push(...action.payload);
    },
  },
});

export const { addToHistory } = eventsHistorySlice.actions;

export default eventsHistorySlice.reducer;
