import { createSlice, current } from "@reduxjs/toolkit";
import { findSensorState } from "../../Utils/Utils";

const initialState = {
  sides: {
    north: [],
    south: [],
    east: [],
    west: [],
  },
};

export const sidesSlice = createSlice({
  name: "sides",
  initialState,
  reducers: {
    setSides: (state, action) => {
      state.sides = action.payload;
    },
    setSide: (state, action) => {
      state.sides = { ...state.sides, ...action.payload };
    },
    setSensorTemp: (state, action) => {
      const { side, id, temperature } = action.payload;
      const sensorIndex = state.sides[side].findIndex((_sensor) => _sensor.id === id);

      if (sensorIndex !== -1) {
        const updatedSensor = {
          ...state.sides[side][sensorIndex],
          temperature: temperature,
        };
        state.sides[side] = [
          ...state.sides[side].slice(0, sensorIndex),
          updatedSensor,
          ...state.sides[side].slice(sensorIndex + 1),
        ];
      }
    },
  },
});

export const { setSides, setSide, setSensorTemp } = sidesSlice.actions;

export default sidesSlice.reducer;
