const Sensor = require("../Models/Sensor");
const context = require("./Context");

const SENSORS_TOTAL_AMOUNT = 10000;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

let intervalId = null;
let prevIntervalMs = context.time.intervalMs;
let eventsOccured = [];

function resetEventsOccured() {
  eventsOccured = [];
}

function createRandomSensors(side, amount = SENSORS_TOTAL_AMOUNT / 4, temp = 20) {
  const online = [];
  const offline = [];
  const malfunction = [];

  for (let i = 0; i < amount; i++) {
    // 1-3 - online, 4 - offline, 5-6 - malfunction
    const type = getRandomNumber(6);

    switch (type) {
      case 1:
      case 2:
      case 3:
        online.push(new Sensor(Date.now(), i, side, temp));
        break;
      case 4:
        offline.push(new Sensor(Date.now() - DAY, i, side, 0, false));
        break;
      case 5:
      case 6:
        malfunction.push(new Sensor(Date.now(), i, side, temp * 0.79));
        break;
    }
  }

  return [...online, ...offline, ...malfunction];
}

function pauseTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  prevIntervalMs = context.time.intervalMs;
}

function resumeTimer() {
  timerInterval();
}

function timerInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    let newHours = context.time.hours;
    let newMinutes = context.time.minutes + 1;

    if (newMinutes >= 60) {
      newMinutes -= 60;
      newHours++;
    }

    if (newHours >= 24) {
      newHours = 0;
    }

    if (context.time.hours !== newHours) {
      addHourlyReport();
    }

    context.time.hours = newHours;
    context.time.minutes = newMinutes;
    context.time.timePassed += MINUTE;
    triggerEvents();
    updateSensorsTimestemps();
  }, context.time.intervalMs);

  prevIntervalMs = context.time.intervalMs;
}

function setSensorData(side, sensorId, data) {
  const { sides } = context;

  const sensor = sides[side].find((_sensor) => _sensor.id === sensorId);
  if ("temperature" in data) sensor.temperature = data.temperature;
  if ("enabled" in data) sensor.enabled = data.enabled;
}

function checkIntervalChange() {
  if (prevIntervalMs !== context.time.intervalMs) {
    timerInterval();
  }
}

function updateSensorsTimestemps() {
  context.sides.east = context.sides.east.map(
    (sensor) =>
      new Sensor(
        sensor.timestamp + (sensor.enabled ? context.time.timePassed : 0),
        sensor.id,
        "east",
        sensor.temperature,
        sensor.enabled
      )
  );
  context.sides.north = context.sides.north.map(
    (sensor) =>
      new Sensor(
        sensor.timestamp + (sensor.enabled ? context.time.timePassed : 0),
        sensor.id,
        "north",
        sensor.temperature,
        sensor.enabled
      )
  );
  context.sides.south = context.sides.south.map(
    (sensor) =>
      new Sensor(
        sensor.timestamp + (sensor.enabled ? context.time.timePassed : 0),
        sensor.id,
        "south",
        sensor.temperature,
        sensor.enabled
      )
  );
  context.sides.west = context.sides.west.map(
    (sensor) =>
      new Sensor(
        sensor.timestamp + (sensor.enabled ? context.time.timePassed : 0),
        sensor.id,
        "west",
        sensor.temperature,
        sensor.enabled
      )
  );
}

function triggerEvents() {
  if (!context.events.enabled) return;
  try {
    const { chance } = context.events;

    const willEventTrigger = getRandomNumber() <= chance;
    if (willEventTrigger) {
      const eventTypes = ["changeTemperature", "enableORDisbaleSensor"];
      const randomIndex = getRandomNumber(eventTypes.length - 1, 0);
      const randomEventType = eventTypes[randomIndex];
      let evenetData = {};

      switch (randomEventType) {
        case "enableORDisbaleSensor":
          Object.keys(context.sides).forEach((side) => {
            const enableORDisbale = getRandomNumber(1, 0);
            const randomSensorIndex = getRandomNumber(context.sides[side].length - 1, 0);
            const sensorData = context.sides[side][randomSensorIndex];
            setSensorData(side, sensorData.id, { enabled: Boolean(enableORDisbale) });
            evenetData[side] = { ...sensorData, enabled: Boolean(enableORDisbale) };
          });
          break;
        case "changeTemperature":
          Object.keys(context.sides).forEach((side) => {
            const increaseORDecrease = getRandomNumber(1, 0);
            const tempChange =
              getRandomNumber(context.events.tempChange[1], context.events.tempChange[0]) *
              (increaseORDecrease ? -1 : 1);
            const randomSensorIndex = getRandomNumber(context.sides[side].length - 1, 0);
            const sensorData = context.sides[side][randomSensorIndex];
            setSensorData(side, sensorData.id, { temperature: sensorData.temperature + tempChange });
            evenetData[side] = { ...sensorData, temperature: sensorData.temperature + tempChange };
          });
          break;
      }
      eventsOccured.push({ type: randomEventType, data: evenetData });
      evenetData = {};
    }
  } catch (error) {
    console.log(error);
  }
}

function addHourlyReport() {
  const hourlyReport = Object.keys(context.sides).map((side) => ({
    [side]: getAverageSensorsTemp(context.sides[side]),
  }));

  eventsOccured.push({
    type: "hourlyReport",
    data: hourlyReport,
  });
}

function getAverageSensorsTemp(sensors) {
  return sensors.reduce((sum, sensor) => sum + sensor.temperature, 0) / (sensors.length || 1) || 0;
}

function getRandomNumber(max = 100, min = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initializer() {
  context.sides = {
    north: createRandomSensors("north"),
    south: createRandomSensors("south"),
    east: createRandomSensors("east"),
    west: createRandomSensors("west"),
  };
  timerInterval();
  setInterval(checkIntervalChange, 1000);
}

module.exports = {
  createRandomSensors,
  initializer,
  pauseTimer,
  resumeTimer,
  eventsOccured,
  getRandomNumber,
  resetEventsOccured,
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  SENSORS_TOTAL_AMOUNT,
};
