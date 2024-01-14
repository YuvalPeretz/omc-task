const context = require("../Utils/Context");

function getTime(req, res) {
  res.send(context.time);
}

module.exports = { getTime };
