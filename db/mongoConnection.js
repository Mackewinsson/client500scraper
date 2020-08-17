const mongoose = require("mongoose");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
// FUNCTION TO CONNECTO TO MONGO
async function connectToMongoDb() {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@client500.6zvzp.mongodb.net/clientsData?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    return "Connected to DB";
  } catch (err) {
    console.error("There is a connection problem to the DB");
    console.error(err);
  }
}

module.exports = connectToMongoDb;
