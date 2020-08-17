const clientData = require("./mongooseSchema");

async function insertToDb(data) {
  // Save data to MONGODB
  const promises = data.map(async (element) => {
    const dataFromDb = await clientData.findOne({ url: element.url });
    if (dataFromDb == null) {
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
      newClient.save();
    }
    await Promise.all(promises);
  });
  console.log("Items inserted to the DB");
}

module.exports = insertToDb;
