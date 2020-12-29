const mongoose = require("mongoose");

const clientData = mongoose.model(
  "ClientData",
  mongoose.Schema({
    url: String,
    titulo: String,
    precio: Number,
    titular: String,
    region: String,
    comuna: String,
    telefono: String,
    telefonoLink: String,
    codigo: Number,
    descripcion: String,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
  })
);

module.exports = clientData;
