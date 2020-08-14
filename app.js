const express = require("express");
// const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const yaposcraper = require("./yapo/yapo");
// const cron = require("node-cron");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// cron.schedule("* * * * *", function () {
//   console.log("---------------------");
//   console.log("Running scraper");

//   //scraper
//   yaposcraper.scrape(
//     "https://www.yapo.cl/region_metropolitana/inmuebles?ca=15_s&l=0&w=1&cmn=&st=a",
//     1
//   );
// });

//scraper

app.use("/", indexRouter);

module.exports = app;
