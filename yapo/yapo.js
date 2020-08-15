// LIBRARIES USED IN THE PROYECT

const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const tesseract = require("./tesseract");
const puppeteer = require("./puppeteer");
const iconv = require("iconv-lite");
require("events").EventEmitter.defaultMaxListeners = 500;

const yaposcrapper = {
  scrape: async (URL, pagesNum) => {
    /* -------------------------------------------------------------------------- */
    /*                               // PAGES NUMBER                              */
    /* -------------------------------------------------------------------------- */

    let pages = pagesNum;
    /* -------------------------------------------------------------------------- */
    /*                      // ARRAY FOR THE FIRST PAGE ITEMS                     */
    /* -------------------------------------------------------------------------- */

    let itemsUrlsArray = [];

    /* -------------------------------------------------------------------------- */
    /*      // ARRAY FOR THE PAGINATION LINKS TO MAKE THE REST OF THE REQUEST     */
    /* -------------------------------------------------------------------------- */

    let paginationUrlsArray = [];

    /* -------------------------------------------------------------------------- */
    /*      // ARRAY FOR THE PAGINATION LINKS TO MAKE THE REST OF THE REQUEST     */
    /* -------------------------------------------------------------------------- */

    let resultsObject = [];
    /* -------------------------------------------------------------------------- */
    /*              // RESQUEST METHOD TO GET RAW HTML FORM THE PAGE              */
    /* -------------------------------------------------------------------------- */
    let response;
    let $;
    try {
      response = await requestPromise({
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
        resolveWithFullResponse: true,
        encoding: null,
      });
    } catch (error) {
      console.error(error);
    }
    // HERE I LOAD THE RESPONSE AND GET THE URLS FOR MY ARRAYS

    $ = cheerio.load(response);

    /* -------------------------------------------------------------------------- */
    /*                      POPULATE THE paginationUrlsArray                      */
    /* -------------------------------------------------------------------------- */

    console.log(`Populating the pagination array...`);
    for (let i = 0; i < pages; i++) {
      if (paginationUrlsArray.length == 0) {
        paginationUrlsArray.push(`${URL}`);
      } else {
        paginationUrlsArray.push(`${URL}&o=${i + 1}`);
      }
    }
    console.log(
      `The paginationUrlsArray has: ${paginationUrlsArray.length} links`
    );
    /* -------------------------------------------------------------------------- */
    /*                     // REQUEST TO EACH PAGINATION LINK                     */
    /* -------------------------------------------------------------------------- */

    for (let i = 0; i < paginationUrlsArray.length; i++) {
      try {
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
          encoding: null,
        });
      } catch (error) {
        console.error(error);
      }
      $ = cheerio.load(response);
      console.log(`Populating the items array...`);
      element = $("td.thumbs_subject > a.title").each(function () {
        itemsUrlsArray.push($(this).attr("href"));
      });
      console.log(`The itemsUrlsArray NOW has: ${itemsUrlsArray.length} links`);
    }

    /* -------------------------------------------------------------------------- */
    /*                   // RESQUEST METHOD FOR THE EACH ARTICLE                  */
    /* -------------------------------------------------------------------------- */

    for (let i = 0; i < itemsUrlsArray.length; i++) {
      console.log(`Scraping item ${i + 1}...`);
      try {
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
          encoding: null,
        });
      } catch (error) {
        console.error(error);
      }
      // DECODE THE RESPONSE BECAUSE IT COMES IN UTF-8 AND SPANISH CHARACTERS WORKS IN ISO-8859-1

      let decodedResponse = iconv.decode(response, "ISO-8859-1");

      // HERE I LOAD THE RESPONSE AND GET THE URLS FOR MY ARRAYS

      $ = cheerio.load(decodedResponse);
      // GETING THE ELEMENTS THAT I NEED FORM EACH ARTICLE
      let url = itemsUrlsArray[i];
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
      let comuna = $('div[class="details"]')
        .find('th:contains("Comuna")')
        .next()
        .text();
      let phoneUrl = $("seller-info").attr("phoneurl").replace(/['"]+/g, "");
      let phoneLink = `https://www.yapo.cl${phoneUrl}`;
      let timePublished = $("time").text();
      let refcode = $('div[id="dataAd"]').attr("data-id");
      let description = $('div[class="description"] > p')
        .text()
        .replace(/(?:\r\n|\r|\n)/g, " ")
        .trim();
      let number;
      /* -------------------------------------------------------------------------- */
      /*                  // SKIP THE PUPPETEER AND TESSERACT PART   IF             */
      /* -------------------------------------------------------------------------- */

      if (phoneLink !== "https://www.yapo.cl") {
        /* -------------------------------------------------------------------------- */
        /*       //  PUPPETEER IMPLEMENTATION TO GET PHONE NUMBER WITH TESSERACT      */
        /* -------------------------------------------------------------------------- */
        await puppeteer.takeSS(phoneLink, "./yapo/logo-screenshot.png");

        /* -------------------------------------------------------------------------- */
        /*                                // TESSERACT                                */
        /* -------------------------------------------------------------------------- */

        number = await tesseract.convertImage("./yapo/logo-screenshot.png");
      } else {
        number = "Sin numero";
        phoneLink = "Sin numero";
      }

      /* -------------------------------------------------------------------------- */
      /*                  // I PUSH THE ELEMENTS TO AN JSON OBJECT                  */
      /* -------------------------------------------------------------------------- */

      resultsObject.push({
        url,
        titulo: title,
        precio: price,
        titular: seller,
        region,
        comuna,
        telefono: number,
        telefonoLink: phoneLink,
        fechaPublicacion: timePublished,
        codigo: refcode,
        descripcion: description,
      });
      // CREATE JSONFILE
      let data = JSON.stringify(resultsObject);
      fs.writeFileSync("resultsObject.json", data);
      console.log(`Scrapped Successfull`);
    }
    // return resultsObject;
  },
};

module.exports = yaposcrapper;
