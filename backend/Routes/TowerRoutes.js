const { Router } = require("express");
const { getTowerData } = require("../Services/TowerServices");

const towerRouter = Router();

towerRouter.get("/", getTowerData);
towerRouter.get("/:side", getTowerData);

module.exports = towerRouter;
