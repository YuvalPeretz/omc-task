class Sensor {
  /**
   * @param {number} timestamp
   * @param {number} id
   * @param {"south" | "east" | "north" | "west"} side
   * @param {number} temperature
   */
  constructor(timestamp, id, side, temperature, enabled = true) {
    this.timestamp = timestamp;
    this.id = id;
    this.side = side;
    this.temperature = temperature;
    this.enabled = enabled;
  }
}

module.exports = Sensor;
