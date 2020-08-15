const connectToMongoDb = require("./mongoConnection");
const clientData = require("./mongooseSchema");
const fs = require("fs");
const mongoose = require("mongoose");

function readData(dataFile) {
  const rawData = fs.readFileSync(dataFile);
  const data = JSON.parse(rawData);
  return data;
}

async function insertToDb() {
  // CONNECT TO MONGODB
  await connectToMongoDb();
  //Read the data file
  const data = await readData("./resultsObject.json");
  // Save data to MONGODB
  data.forEach(async (element) => {
    const dataFromDb = await clientData.findOne({ url: element.url });
    if (dataFromDb == null) {
      const dataModel = new clientData({
        url: element.url,
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
    }
  });
  console.log("Data SAVED to DB");
}
// Some is happening with the reading of the data
// Is working in this file but not in app.js
// when i put mongoose.disconnect NOT WORKING

module.exports = insertToDb;
