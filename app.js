const yaposcraper = require("./yapo/yapo");
const insertToDb = require("./db/insertToDb");
const connectToMongoDb = require("./db/mongoConnection");
const jsonCsv = require('./utils/jsonCsv');
const jsonToCsv = require("./utils/jsonCsv");

const URL =
  "https://www.yapo.cl/region_metropolitana/inmuebles?ca=15_s&l=0&f=p&w=1&cmn=&st=a";

async function main() {
  try {
    const connect = await connectToMongoDb();
    console.log(connect);
    // SCRAPE
    const data = await yaposcraper.scrape(URL, 1);
    // INSERT DATA TO DB
    // await insertToDb(data);
    // Create CSV
    await jsonToCsv(data);
  } catch (err) {
    console.error(err);
  }
}

main();
