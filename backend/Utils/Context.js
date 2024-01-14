const context = {
  events: {
    enabled: false,
    chance: 10, // 1%
    tempChange: [0, 5],
  },
  time: {
    intervalMs: 100,
    hours: 0,
    minutes: 0,
    timePassed: 0,
  },
  sides: {
    north: [],
    south: [],
    east: [],
    west: [],
  },
};

module.exports = context;
