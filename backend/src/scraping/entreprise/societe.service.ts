const puppeteer = require('puppeteer');
const resourceURL = 'https://www.societe.com/societe/';
const testValue = 'sarl-favata-338411101';

async function fetch(company_and_siren) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
  );
  await page.setViewport({ width: 1366, height: 768 });
  console.log(`${resourceURL}${company_and_siren}.html`);
  await page.goto(`${resourceURL}${company_and_siren}.html`);

  const element = await page.$('#rensjur'); // Renseignements juridiques
  const texte = await page.evaluate((element) => element.innerText, element);

  // les renseignements sont randomisés, donc on ne peut pas les scrapper
  // le site est protégé contre le scrapping
  // les balises sont intactes
  // mais les données sont randomisées

  await browser.close();

  return texte;
}

fetch(testValue)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err.message);
  });
