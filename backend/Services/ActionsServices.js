const Sensor = require("../Models/Sensor");
const context = require("../Utils/Context");
const { eventsOccured, SENSORS_TOTAL_AMOUNT, DAY } = require("../Utils/Utils");

function resetTowerData(req, res) {
  context.sides = {
    north: Array.from({ length: SENSORS_TOTAL_AMOUNT / 4 }).map((_, id) => new Sensor(Date.now(), id, "north", 20)),
    south: Array.from({ length: SENSORS_TOTAL_AMOUNT / 4 }).map((_, id) => new Sensor(Date.now(), id, "south", 20)),
    east: Array.from({ length: SENSORS_TOTAL_AMOUNT / 4 }).map((_, id) => new Sensor(Date.now(), id, "east", 20)),
    west: Array.from({ length: SENSORS_TOTAL_AMOUNT / 4 }).map((_, id) => new Sensor(Date.now(), id, "west", 20)),
  };

  res.status(200).send(true);
}

function setTowerData(req, res) {
  const { side, online, offline, malfunction } = req.body;

  const updatedSide = {
    online: online ?? context.sides[side].online,
    offline: offline ?? context.sides[side].offline,
    malfunction: malfunction ?? context.sides[side].malfunction,
  };

  context.sides = { ...context.sides, [side]: updatedSide };

  res.send(JSON.stringify({ [side]: updatedSide }));
}

function getEvents(req, res) {
  const copyOfEventsOccured = [...eventsOccured];

  const startingIndex =
    req.body.startIndex ?? (copyOfEventsOccured.length - 1 < 0 ? 0 : copyOfEventsOccured.length - 1);

  res.send(
    JSON.stringify({
      length: copyOfEventsOccured.length,
      data: copyOfEventsOccured.slice(startingIndex),
    })
  );
}

function getWeekReport(req, res) {
  const maxReports = DAY * 7;
  const reports = eventsOccured.filter((event) => event.type === "hourlyReport").slice(-maxReports);

  let sumTemperatures = { north: 0, south: 0, east: 0, west: 0 };
  let reportCount = 0;

  reports.forEach((report) => {
    sumTemperatures.north += report.data[0].north;
    sumTemperatures.south += report.data[1].south;
    sumTemperatures.east += report.data[2].east;
    sumTemperatures.west += report.data[3].west;
    reportCount++;
  });

  const averageTemperatures = {
    north: reportCount > 0 ? sumTemperatures.north / reportCount : 0,
    south: reportCount > 0 ? sumTemperatures.south / reportCount : 0,
    east: reportCount > 0 ? sumTemperatures.east / reportCount : 0,
    west: reportCount > 0 ? sumTemperatures.west / reportCount : 0,
  };

  res.json(averageTemperatures);
}

function updateContext(req, res) {
  context.events = { ...context.events, ...req.body.events };
  context.time.intervalMs = req.body.intervalMs ?? context.time.intervalMs;
  res.send(true);
}

function getContext(req, res) {
  res.send(context);
}

module.exports = { resetTowerData, setTowerData, getEvents, getWeekReport, updateContext, getContext };
