const { Parser } = require('json2csv');
const fs = require("fs");

const jsonToCsv = (data) =>{

    const json = data;
    console.log(json);

     // HERE I CONVERT JSON TO CSV

    console.log("1. Starting JSON to CSV...");
    const fields = [
        "titulo",
        "precio",
        "titular",
        "region",
        "comuna",
        "telefono",
        "telefonolink",
        "fechaPublicacion",
        "codigo",
        "descripcion",
    ]; // I SPECIFY THE FIELDS THAT I NEED
    const json2csvParser = new Parser({
        fields: fields, // I SPECIFY THE FIELDS THAT I NEED
        quote: "", // I ELIMINATE THE QUOTES FORM THE FIELDS
        delimiter: '"', // I CHANGE THE DELIMITER FROM , WHICH IS DEFAULT TO "
        defaultValue: "No info", // THIS IS THE DEFAULT VALUE WHEN THERE IS NO INFO IN THE FIELD
    });

    const csv = json2csvParser.parse(json);
    fs.writeFileSync("./results.csv", csv, "utf-8");
    console.log("2. Done JSON to CSV...");

};

module.exports = jsonToCsv;
