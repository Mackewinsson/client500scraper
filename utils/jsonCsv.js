const { Parser } = require('json2csv');

const jsonToCsv = (data) =>{

     // HERE I CONVERT JSON TO CSV

  console.log("1. Starting JSON to CSV...");
  const fields = [
    "title",
    "price",
    "seller",
    "phone",
    "ispro",
    "region",
    "phoneUrl",
    "timePublished",
    "refcode",
    "description",
  ]; // I SPECIFY THE FIELDS THAT I NEED
  const json2csvParser = new Parser({
    fields: fields, // I SPECIFY THE FIELDS THAT I NEED
    quote: "", // I ELIMINATE THE QUOTES FORM THE FIELDS
    delimiter: '"', // I CHANGE THE DELIMITER FROM , WHICH IS DEFAULT TO "
    defaultValue: "No info", // THIS IS THE DEFAULT VALUE WHEN THERE IS NO INFO IN THE FIELD
  });

  const csv = json2csvParser.parse(data);
  fs.writeFileSync("./results.csv", csv, "utf-8");
  console.log(chalk.blueBright("2. Done JSON to CSV..."));

};

 
