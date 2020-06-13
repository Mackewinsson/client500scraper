// LIBRARIES USED IN THE PROYECT

const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const chalk = require("chalk");
const fs = require("fs");
const { Parser } = require("json2csv");
const iconv = require("iconv-lite");
const puppeteer = require("puppeteer");
const { createWorker } = require("tesseract.js");
const { data } = require("./resultsObject.json");
require("events").EventEmitter.defaultMaxListeners = 500;

// PARAMETROS DE BUSQUEDA

const region = ["region_metropolitana"];
const tipo = ["comprar", "arrendar", "todos_los_avisos"];
const palabraClave = "dueño";

// THIS IS WHERE THE URL IS PLACED
let URL = `https://www.yapo.cl/region_metropolitana/comprar?ca=15_s&l=0&q=due%C3%B1o&w=1&cmn=313&cmn=315&cmn=323&cmn=330&cmn=340&cmn=343`;
console.log(URL);
// ARRAY FOR THE FIRST PAGE ITEMS
let itemsUrlsArray = [];
// ARRAY FOR THE PAGINATION LINKS TO MAKE THE REST OF THE REQUEST
let paginationUrlsArray = [];
// ARRAY FOR THE PAGINATION LINKS TO MAKE THE REST OF THE REQUEST
let resultsObject = [];

// ASYNC FUNCTION THAT EXECUTES INMEDIATLY WITH THE REQUEST TO THE URL
(async () => {
  // RESQUEST METHOD TO GET RAW HTML FORM THE PAGE

  let response = await requestPromise({
    // PARAMETERS FOR THE REQUEST METHOD

    uri: URL,

    // this headers depens on the WEBPAGE that you want to scrape

    headers: {
      authority: "www.yapo.cl",
      method: "GET",
      path: "/",
      scheme: "https",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "es-419,es;q=0.9",
      "cache-control": "max-age=0",
      referer:
        "https://www.yapo.cl/region_metropolitana/celulares?ca=15_s&l=0&q=airpods&w=1&cmn=&ps=2&pe=4",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
    },

    // GZIP PARAMETER IS NECESARY TO UNZIP THE RESULTS FROM GZIP

    gzip: true,
  });

  // HERE I LOAD THE RESPONSE AND GET THE URLS FOR MY ARRAYS

  let $ = cheerio.load(response);

  // Find the number of PAGES in the results

  // let articleItems = $("#tabnav > li.tab_region > h2 > span:nth-child(2)")
  //   .text()
  //   .trim()
  //   .match(/(\d).(\d+)/g);
  // console.log(articleItems);
  // debugger;
  // let itemsNumber;
  // if (articleItems[0] > 999) {
  //   itemsNumber = parseInt(articleItems[0].replace(/(\d+)(.)(\d+)/g, "$1$3"));
  // } else {
  //   itemsNumber = parseInt(articleItems[0]);
  // }

  let pages = 11;

  // Math.ceil(itemsNumber / 50);
  // POPULATE THE paginationUrlsArray

  for (let i = 0; i < pages; i++) {
    if (paginationUrlsArray.length == 0) {
      paginationUrlsArray.push(`${URL}`);
    } else {
      paginationUrlsArray.push(`${URL}&o=${i + 1}`);
    }
  }
  console.log(
    chalk.green(
      `The paginationUrlsArray has: ${paginationUrlsArray.length} links`
    )
  );

  // REQUEST TO EACH PAGINATION LINK

  for (let i = 0; i < paginationUrlsArray.length; i++) {
    response = await requestPromise({
      // PARAMETERS FOR THE REQUEST METHOD

      uri: paginationUrlsArray[i],

      // this headers depens on the WEBPAGE that you want to scrape

      headers: {
        authority: "www.yapo.cl",
        method: "GET",
        path: "/",
        scheme: "https",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "es-419,es;q=0.9",
        "cache-control": "max-age=0",
        referer:
          "https://www.yapo.cl/region_metropolitana/celulares?ca=15_s&l=0&q=airpods&w=1&cmn=&ps=2&pe=4",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
      },

      // GZIP PARAMETER IS NECESARY TO UNZIP THE RESULTS FROM GZIP

      gzip: true,
    });
    $ = cheerio.load(response);
    element = $("td.thumbs_subject > a.title").each(function () {
      itemsUrlsArray.push($(this).attr("href"));
    });
    console.log(
      chalk.green(`The itemsUrlsArray NOW has: ${itemsUrlsArray.length} links`)
    );
  }
  console.log(itemsUrlsArray);

  // RESQUEST METHOD FOR THE EACH ARTICLE

  for (let i = 0; i < itemsUrlsArray.length; i++) {
    response = await requestPromise({
      // PARAMETERS FOR THE REQUEST METHOD

      uri: itemsUrlsArray[i],

      // this headers depens on the WEBPAGE that you want to scrape

      headers: {
        authority: "www.yapo.cl",
        method: "GET",
        path: "/",
        scheme: "https",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "es-419,es;q=0.9",
        "cache-control": "max-age=0",
        referer:
          "https://www.yapo.cl/region_metropolitana/celulares?ca=15_s&l=0&q=airpods&w=1&cmn=&ps=2&pe=4",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
      },

      // GZIP PARAMETER IS NECESARY TO UNZIP THE RESULTS FROM GZIP

      gzip: true,
    });

    // DECODE THE RESPONSE BECAUSE IT COMES IN UTF-8 AND SPANISH CHARACTERS WORKS IN ISO-8859-1

    // let utf8String = iconv.decode(response, "ISO-8859-1");

    // HERE I LOAD THE RESPONSE AND GET THE URLS FOR MY ARRAYS

    $ = cheerio.load(response);

    // GETING THE ELEMENTS THAT I NEED FORM EACH ARTICLE

    let title = $('h1[id="da_subject"]').text();
    let price = $('div[id="dataAd"]').attr("data-price");
    let seller = $("seller-info").attr("username");
    let ispro = $("seller-info").attr("ispro");
    if (ispro === "true") {
      ispro = "Aviso profesional";
    } else {
      ispro = "Aviso personal";
    }
    let region = $("seller-info").attr("region");
    let phoneUrl = $("seller-info").attr("phoneurl").replace(/['"]+/g, "");
    let phone = `https://www.yapo.cl${phoneUrl}`;
    let timePublished = $("time").text();
    let refcode = $('div[id="dataAd"]').attr("data-id");
    let description = $('div[class="description"] > p')
      .text()
      .replace(/(?:\r\n|\r|\n)/g, "")
      .trim();
    let link = itemsUrlsArray[i];

    // PUPPETEER IMPLEMENTATION TO GET PHONE NUMBER WITH TESSERACT

    const browser = await puppeteer.launch({
      // devtools: true,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });
    const page = await browser.newPage();

    // STARTING PAGE

    await page.goto(phone, { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      const body = document.querySelector("body");
      body.style.backgroundColor = "white";
    });
    const svgImage = await page.$("img");
    await svgImage.screenshot({
      path: "./logo-screenshot.png",
    });
    const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
    };
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize("./logo-screenshot.png");
    // phone = text; text.replace(/(.....)(\s+)(\d{9}.?.?)/g, "(+56) $3");
    console.log(text);
    await worker.terminate();

    // I PUSH THE ELEMENTS TO AN JSON OBJECT

    resultsObject.push({
      title,
      price,
      seller,
      ispro,
      region,
      phone,
      timePublished,
      refcode,
      description,
    });
    console.log(chalk.blue(`Item ${i + 1} Scraped...`));
    // let stream = fetch(`https://www.yapo.cl${phoneUrl}`, {
    //   headers: {
    //     accept:
    //       "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    //     "accept-encoding": "gzip, deflate, br",
    //     "accept-language": "es-419,es;q=0.9",
    //     "cache-control": "max-age=0",
    //     referer:
    //       "https://www.yapo.cl/region_metropolitana/celulares?ca=15_s&l=0&q=airpods&w=1&cmn=&ps=2&pe=4",
    //     "sec-fetch-dest": "document",
    //     "sec-fetch-mode": "navigate",
    //     "sec-fetch-site": "same-origin",
    //     "sec-fetch-user": "?1",
    //     "upgrade-insecure-requests": "1",
    //     "user-agent":
    //       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
    //   },
    // }).then((res) => {
    //   const dest = fs.createWriteStream("./temp.gif");
    //   res.body.pipe(dest);
    // });
  }

  // HERE I CONVERT JSON TO CSV

  console.log(chalk.blue("1. Starting JSON to CSV..."));
  const fields = [
    "title",
    "price",
    "seller",
    "ispro",
    "region",
    "phone",
    "timePublished",
    "refcode",
    "description",
  ]; // I SPECIFY THE FIELDS THAT I NEED
  const json2csvParser = new Parser({
    fields: fields, // I SPECIFY THE FIELDS THAT I NEED
    // quote: "", // I ELIMINATE THE QUOTES FORM THE FIELDS
    // delimiter: '"', // I CHANGE THE DELIMITER FROM , WHICH IS DEFAULT TO "
    defaultValue: "No info", // THIS IS THE DEFAULT VALUE WHEN THERE IS NO INFO IN THE FIELD
  });

  const csv = json2csvParser.parse(resultsObject);
  fs.writeFileSync("./results.csv", csv, "utf-8");
  console.log(chalk.blueBright("2. Done JSON to CSV..."));
  //   nuevo
})();
