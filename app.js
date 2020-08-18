const yaposcraper = require("./yapo/yapo");
const insertToDb = require("./db/insertToDb");
const connectToMongoDb = require("./db/mongoConnection");
const http = require("http");

const URL =
  "https://www.yapo.cl/region_metropolitana/inmuebles?ca=15_s&l=0&f=p&w=1&cmn=&st=a";

const express = require("express");
const app = express();

app.set("port", process.env.PORT || 5000);

//For avoidong Heroku $PORT error
app
  .get("/", function (request, response) {
    var result = "App is running";
    response.send(result);
  })
  .listen(app.get("port"), function () {
    console.log(
      "App is running, server is listening on port ",
      app.get("port")
    );
  });

(async () => {
  try {
    const connect = await connectToMongoDb();
    console.log(connect);
    // SCRAPE
    const data = await yaposcraper.scrape(URL, 1);
    // INSERT DATA TO DB
    await insertToDb(data);
  } catch (err) {
    console.error(err);
  }
})();
