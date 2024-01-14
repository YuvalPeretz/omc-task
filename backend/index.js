const express = require("express");
const cors = require("cors");
const towerRouter = require("./Routes/TowerRoutes");
const actionsRouter = require("./Routes/ActionsRoutes");
const { initializer } = require("./Utils/Utils");
const timeRouter = require("./Routes/TimeRouter");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/tower", towerRouter);
app.use("/actions", actionsRouter);
app.use("/time", timeRouter);

initializer();

app.listen(3001, () => console.log(`Server started at: http://localhost:3001/`));
