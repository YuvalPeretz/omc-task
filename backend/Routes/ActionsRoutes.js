const { Router } = require("express");
const {
  resetTowerData,
  setTowerData,
  getEvents,
  getWeekReport,
  updateContext,
  getContext,
} = require("../Services/ActionsServices");

const actionsRouter = Router();

actionsRouter.post("/", getEvents);
actionsRouter.get("/reset", resetTowerData);
actionsRouter.post("/set", setTowerData);
actionsRouter.get("/weekReport", getWeekReport);
actionsRouter.post("/updateContext", updateContext);
actionsRouter.get("/getContext", getContext);

module.exports = actionsRouter;
