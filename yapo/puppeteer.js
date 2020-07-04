const puppeteer = require('puppeteer');

const screenshot = {
  takeSS: async (URL, SSpath) => {
    const browser = await puppeteer.launch({
      // devtools: true,
      // headless: false,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });
    const page = await browser.newPage();

    // STARTING PAGE

    await page.goto(URL, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      const body = document.querySelector('body');
      body.style.backgroundColor = 'white';
    });
    // const svgImage = await page.$('img');
    // await svgImage
    await page.screenshot({
      path: SSpath,
    });
    await browser.close();
  },
};

module.exports = screenshot;
