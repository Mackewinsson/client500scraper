const yaposcraper = require("./yapo/yapo");
const mongoose = require("mongoose");
const fs = require("fs");
const connectToMongoDb = require("./db/mongoConnection");
const clientData = require("./db/mongooseSchema");
require("dotenv").config();

function readData(dataFile) {
  const rawData = fs.readFileSync(dataFile);
  const data = JSON.parse(rawData);
  return data;
}

(async () => {
  // CONNECT TO MONGODB
  await connectToMongoDb();
  // SCRAPE
  await yaposcraper.scrape(
    "https://www.yapo.cl/region_metropolitana/inmuebles?ca=15_s&l=0&w=1&cmn=&st=a",
    1
  );
  //Read the data file
  const data = await readData("./resultsObject.json");
  // Save data to MONGODB
  data.forEach((element) => {
    const dataModel = new clientData({
      titulo: element.titulo,
      precio: element.precio,
      titular: element.titular,
      region: element.region,
      comuna: element.comuna,
      telefono: element.telefono,
      telefonoLink: element.telefonoLink,
      fechaPublicacion: element.fechaPublicacion,
      codigo: element.codigo,
      descripcion: element.descripcion,
    });
    dataModel.save();
  });
})();
