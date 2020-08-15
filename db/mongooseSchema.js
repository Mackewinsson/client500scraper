const mongoose = require("mongoose");

const clientData = mongoose.model(
  "ClientData",
  mongoose.Schema({
    url: String,
    titulo: String,
    precio: String,
    titular: String,
    region: String,
    comuna: String,
    telefono: String,
    telefonoLink: String,
    codigo: Number,
    descripcion: String,
  })
);

module.exports = clientData;
