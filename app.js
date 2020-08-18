const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const main = require("./main");
var cron = require("node-cron");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// CRON JOB
cron.schedule("*/5 * * * *", () => {
  main();
});

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
