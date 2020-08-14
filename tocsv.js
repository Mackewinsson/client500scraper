const fs = require('fs');
const { Parser } = require('json2csv');

const data = fs.readFileSync('./resultsObject1.json');
const resultsObject = JSON.parse(data);
const fields = [
  'id',
  'titulo',
  'precio',
  'dueno',
  'tipoAviso',
  'region',
  'comuna',
  'telefono',
  'telefonoLink',
  'fechaPublicacion',
  'codigo',
  'descripcion',
];

// I SPECIFY THE FIELDS THAT I NEED
const json2csvParser = new Parser({
  fields: fields, // I SPECIFY THE FIELDS THAT I NEED
  // quote: "", // I ELIMINATE THE QUOTES FORM THE FIELDS
  // delimiter: '"', // I CHANGE THE DELIMITER FROM , WHICH IS DEFAULT TO "
  defaultValue: 'No info', // THIS IS THE DEFAULT VALUE WHEN THERE IS NO INFO IN THE FIELD
});

const csv = json2csvParser.parse(resultsObject);
// const ramdom = Math.floor(Math.random() * (1000000 - 100)) + 100;
fs.writeFileSync(`./results/results.csv`, csv, 'utf-8');
console.log('Done JSON to CSV...');
