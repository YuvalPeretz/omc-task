import { logToConsole } from "../Redux/Reducers/ConsoleSlice";
import { setSensorTemp, setSides } from "../Redux/Reducers/SidesSlice";
import { store } from "../Redux/store";
import { getTowerData } from "./Server";

const { dispatch } = store;

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export function toTitleCase(inputString) {
  return inputString.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\w/, (match) => match.toUpperCase());
}

export function logger(logData) {
  console.info(logData);
  dispatch(logToConsole(logData));
}

export function handleEvents(events) {
  const { dispatch } = store;
  for (const event of events) {
    const { type, data } = event;
    switch (type) {
      case "enableORDisbaleSensor":
        break;
      case "changeTemperature":
        Object.keys(data).forEach((side) => dispatch(setSensorTemp({ ...data[side], side })));
        refreshAllSidesData();
        break;
    }
  }
}

export async function refreshAllSidesData() {
  const { dispatch } = store;
  const data = await getTowerData();
  dispatch(setSides(data));
}

export function getAverageSensorsTemp(sensors) {
  return sensors.reduce((sum, sensor) => sum + sensor.temperature, 0) / (sensors.length || 1) || 0;
}

export function getSensorStates(sensors) {
  const { timePassed } = store.getState().time;
  const avrgSensorTemp = getAverageSensorsTemp(sensors);
  const online = [];
  const offline = [];
  const malfunction = [];

  sensors.forEach((sensor) => {
    if (sensor.timestamp <= Date.now() + timePassed - DAY) offline.push(sensor);
    else if (sensor.temperature <= avrgSensorTemp * 0.8 || avrgSensorTemp * 1.2 <= sensor.temperature)
      malfunction.push(sensor);
    else online.push(sensor);
  });

  return { online, offline, malfunction };
}
