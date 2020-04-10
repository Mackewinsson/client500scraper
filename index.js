// LIBRARIES USED IN THE PROYECT 

const request = require('request-promise');
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require('fs');
const { Parser } = require('json2csv');


// THIS IS WHERE THE URL IS PLACED
const URL = 'https://www.yapo.cl/region_metropolitana/inmuebles?ca=15_s&l=0&q=Due%F1o&w=1&cmn=313&cmn=315&cmn=316&cmn=330&cmn=343&cmn=346&st=s';
// ARRAY FOR THE FIRST PAGE ITEMS
let itemsUrlsArray = [];
// ARRAY FOR THE PAGINATION LINKS TO MAKE THE REST OF THE REQUEST 
let paginationUrlsArray = [];
// ARRAY FOR THE PAGINATION LINKS TO MAKE THE REST OF THE REQUEST 
let resultsObject = [];

// ASYNC FUNCTION THAT EXECUTES INMEDIATLY WITH THE REQUEST TO THE URL
(async () => {

    // RESQUEST METHOD TO GET RAW HTML FORM THE PAGE
    
    let response = await request({

        // PARAMETERS FOR THE REQUEST METHOD

        uri: URL,

        // this headers depens on the WEBPAGE that you want to scrape
        
        headers: {
            'authority': 'www.yapo.cl',
            'method': 'GET',
            'path': '/',
            'scheme': 'https',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'es-419,es;q=0.9',
            'cache-control': 'max-age=0',
            'referer': 'https://www.yapo.cl/region_metropolitana/celulares?ca=15_s&l=0&q=airpods&w=1&cmn=&ps=2&pe=4',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
        },

        // GZIP PARAMETER IS NECESARY TO UNZIP THE RESULTS FROM GZIP

        gzip: true

    });

    // HERE I LOAD THE RESPONSE AND GET THE URLS FOR MY ARRAYS

    let $ = cheerio.load(response);

    // FIRST I POPULATE THE itemsUrlsArray

    let element = $('table[class="listing_thumbs"] > tbody > tr > td > a[class="title"]').each(function(){
        
        itemsUrlsArray.push($(this).attr('href'));

    });
    console.log(chalk.green(`The paginationUrlsArray has: ${itemsUrlsArray.length} links`));

    // SECOND I POPULATE THE paginationUrlsArray  
    
    element = $('div > span[class="nohistory"] > a').each(function(){

        paginationUrlsArray.push($(this).attr('href'));

    });

    console.log(chalk.green(`The paginationUrlsArray has: ${paginationUrlsArray.length} links`));



        // RESQUEST METHOD FOR LOOP
        for(let i = 0; i < itemsUrlsArray.length; i++){

            response = await request({

                // PARAMETERS FOR THE REQUEST METHOD
    
                uri: itemsUrlsArray[i],
    
                // this headers depens on the WEBPAGE that you want to scrape
                
                headers: {
                    'authority': 'www.yapo.cl',
                    'method': 'GET',
                    'path': '/',
                    'scheme': 'https',
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'es-419,es;q=0.9',
                    'cache-control': 'max-age=0',
                    'referer': 'https://www.yapo.cl/region_metropolitana/celulares?ca=15_s&l=0&q=airpods&w=1&cmn=&ps=2&pe=4',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-user': '?1',
                    'upgrade-insecure-requests': '1',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
                },
    
                // GZIP PARAMETER IS NECESARY TO UNZIP THE RESULTS FROM GZIP
    
                gzip: true
    
            });
    
            // HERE I LOAD THE RESPONSE AND GET THE URLS FOR MY ARRAYS
    
            $ = cheerio.load(response);
    
            let title = $('h1[id="da_subject"]').text();
            let price = $('div[id="dataAd"]').attr('data-price');
            let seller = $('seller-info').attr('username');
            let phoneUrl = $('seller-info').attr('phoneurl').replace(/['"]+/g, '');
            let timePublished = $('time').text();
            let refcode = $('div[id="dataAd"]').attr('data-id');
            let description = $('div[class="description"] > p').text().replace(/(?:\r\n|\r|\n)/g, '').trim();

            resultsObject.push({
                title,
                price,
                seller,
                phoneUrl:`https://www.yapo.cl${phoneUrl}`,
                timePublished,
                refcode,
                description
            });
            console.log(`Item ${i+1} Scraped...`);
        };
        console.log('1. Starting JSON to CSV...');
        const fields = ['title', 'price', 'seller', 'phoneUrl', 'timePublished', 'refcode', 'description'];
        const json2csvParser = new Parser({
            fields: fields,
            quote: '',
            delimiter: '"',
            defaultValue: 'No info'
         });
        const csv = json2csvParser.parse(resultsObject);
        fs.writeFileSync('./results.csv', csv, 'utf-8');
        console.log('2. Done JSON to CSV...');
         debugger
})()