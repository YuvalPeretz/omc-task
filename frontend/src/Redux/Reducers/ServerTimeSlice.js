import { createSlice, current } from "@reduxjs/toolkit";

const initialState = { hours: 0, minutes: 0, timePassed: 0 };

export const serverTimeSlice = createSlice({
  name: "serverTime",
  initialState,
  reducers: {
    setTime: (state, action) => {
      action.payload.hours && (state.hours = action.payload.hours);
      action.payload.minutes && (state.minutes = action.payload.minutes);
      action.payload.timePassed && (state.timePassed = action.payload.timePassed);
    },
  },
});

export const { setTime } = serverTimeSlice.actions;

export default serverTimeSlice.reducer;
