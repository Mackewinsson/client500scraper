const { createWorker } = require('tesseract.js');

const tesseract = {
  convertImage: async (imagepath) => {
    let convertedToText;
    const config = {
      lang: 'eng',
      oem: 1,
      psm: 3,
    };
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const {
      data: { text },
    } = await worker.recognize(imagepath);
    convertedToText = text;
    // .replace(/(\+[()\d]+)\s(\d+)/g, '(+56) $2');
    await worker.terminate();
    return convertedToText;
  },
};

module.exports = tesseract;
