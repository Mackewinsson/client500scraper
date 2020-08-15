const yaposcraper = require("./yapo/yapo");
const insertToDb = require("./db/insertToDb");

(async () => {
  try {
    // SCRAPE
    await yaposcraper.scrape(
      "https://www.yapo.cl/region_metropolitana/inmuebles?ca=15_s&l=0&w=1&cmn=304&st=a",
      1
    );
  } catch (err) {
    console.error(err);
  }
  // INSERT DATA TO DB
  await insertToDb();
  process.exit();
})();
