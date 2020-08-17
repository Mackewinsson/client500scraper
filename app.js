const yaposcraper = require("./yapo/yapo");
const insertToDb = require("./db/insertToDb");
const connectToMongoDb = require("./db/mongoConnection");
const mongoose = require("mongoose");

const URL =
  "https://www.yapo.cl/region_metropolitana/inmuebles?ca=15_s&l=0&f=p&w=1&cmn=&st=a";

(async () => {
  try {
    // SCRAPE
    const data = await yaposcraper.scrape(URL, 1);
    // INSERT DATA TO DB
    await connectToMongoDb();
    await insertToDb(data);
    process.exit();
  } catch (err) {
    console.error(err);
  }
})();
