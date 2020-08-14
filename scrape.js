const yaposcraper = require("./yapo/yapo");
const mongoose = require("mongoose");
const fs = require("fs");
const clientData = require("./db/mongooseSchema");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

async function connectToMongoDb() {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@client500.6zvzp.mongodb.net/<dbname>?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to DB");
  } catch (err) {
    console.error("There is a connection problem to the DB");
    console.error(err);
  }
}

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
