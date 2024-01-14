const context = require("../Utils/Context");

function getTowerData(req, res) {
  const side = req.params.side;
  const { sides } = context;

  const sidesWithutEnabled = Object.keys(sides).reduce((newObj, side) => {
    newObj[side] = sides[side].map(({ enabled, ...rest }) => rest);
    return newObj;
  }, {});

  res.send(JSON.stringify(side ? { [side]: sidesWithutEnabled[side] } : sidesWithutEnabled));
}

module.exports = { getTowerData };
