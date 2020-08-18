const clientData = require("./mongooseSchema");

async function insertToDb(data) {
  // Save data to MONGODB
  const promises = data.map(async (element) => {
    const dataFromDb = await clientData.findOne({ codigo: element.codigo });
    if (dataFromDb) {
      console.log("Item is already in the DB");
    } else if (dataFromDb == null) {
      console.log("Item NOT in the db");
      const newClient = new clientData({
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
      await newClient.save();
    }
    await Promise.all(promises);
  });
  console.log("Items inserted to the DB");
}

module.exports = insertToDb;
