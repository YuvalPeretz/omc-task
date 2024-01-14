import { configureStore } from "@reduxjs/toolkit";
import consoleReducer from "./Reducers/ConsoleSlice";
import eventsHistoryReducer from "./Reducers/EventsHistorySlice";
import sidesReducer from "./Reducers/SidesSlice";
import serverTimeReducer from "./Reducers/ServerTimeSlice";

export const store = configureStore({
  reducer: {
    console: consoleReducer,
    eventsHistory: eventsHistoryReducer,
    sidesData: sidesReducer,
    time: serverTimeReducer,
  },
});
