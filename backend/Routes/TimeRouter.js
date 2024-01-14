const { Router } = require("express");
const { getTime } = require("../Services/TimeService");

const timeRouter = Router();

timeRouter.get("/", getTime);

module.exports = timeRouter;
