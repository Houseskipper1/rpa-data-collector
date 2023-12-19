import { Injectable } from '@nestjs/common';
import { EntrepriseEntity } from 'src/entreprise/entities/entreprise.entity';
import * as puppeteer from 'puppeteer';


@Injectable()
export class SocieteService {

  private _entreprisesData: string[] = [
    'sarl-favata-338411101',
    'bati-france-57-851900654',
    'lenninger-arthur-918347071',
  ];
  private _url = 'https://www.societe.com/societe/';

  constructor() {}

  async fetch() {
    const entreprise = new EntrepriseEntity();
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36");
    await page.setViewport({ width: 1366, height: 768});
    await page.goto(`${this._url}${this._entreprisesData[0]}.html`);
    
    const nomCommercial = await page.waitForSelector('td ::-p-text(Noms commerciaux)');
    entreprise.name = await page.evaluate((el) => el.nextElementSibling.textContent, nomCommercial);
    const siren = await page.waitForSelector('#siren_number > span');
    entreprise.siren = await page.evaluate((el) => el.textContent, siren);
    const siret = await page.waitForSelector('#siret_number > span');
    entreprise.siret = await page.evaluate((el) => el.textContent, siret);
    const dateCreation = await page.waitForSelector('td ::-p-text(Date création entreprise)');
    entreprise.dateCreation = await page.evaluate((el) => el.nextElementSibling.firstElementChild.firstElementChild.textContent, dateCreation);

    await browser.close();

    return entreprise;
  }


}
