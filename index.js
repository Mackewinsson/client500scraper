const yaposcrapper = require('./yapo/yapo');
const URL =
  'https://www.yapo.cl/region_metropolitana/inmuebles?ca=15_s&l=0&f=p&w=1&cmn=&st=a';

yaposcrapper.scrape(URL, 1);
