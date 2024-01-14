import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

export const consoleSlice = createSlice({
  name: "console",
  initialState,
  reducers: {
    logToConsole: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
  },
});

export const { logToConsole } = consoleSlice.actions;

export default consoleSlice.reducer;
