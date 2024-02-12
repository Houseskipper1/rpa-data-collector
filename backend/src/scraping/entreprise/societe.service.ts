import { Injectable } from '@nestjs/common';
import { EntrepriseEntity } from 'src/entreprise/entities/entreprise.entity';
import * as puppeteer from 'puppeteer';
import { EntreprisesIdsDto } from 'src/entreprise/dto/entreprisesids.dto';
import { EntrepriseRepresentativeEntity } from 'src/entreprise/entities/entreprise.representative.entity';
import { LocationEntrepriseEntity } from 'src/entreprise/entities/entreprise.location.entity';
import { FinanceEntrepriseEntity } from 'src/entreprise/entities/entreprise.Finance.entity';

// https://www.societe.com/societe/sarl-favata-338411101.html

@Injectable()
export class SocieteService {
  private _entreprisesData: string[] = [
    'sarl-favata-338411101',
    'bati-france-57-851900654',
    'lenninger-arthur-918347071',
  ];
  private _urlIdentity = 'https://www.societe.com/societe/';
  private _urlRepresentatives = 'https://www.societe.com/dirigeants/';

  constructor() {}

  async fetch(entreprisesIdsDto: EntreprisesIdsDto) {
    const entreprisesIds = entreprisesIdsDto.entreprises.split(',');
    const entreprisesData: EntrepriseEntity[] = [];
    for (const entrepriseId of entreprisesIds) {
      const entreprise = await this.fetchEntity(entrepriseId);
      entreprisesData.push(entreprise);
    }
    return entreprisesData;
  }

  async fetchEntity(entrepriseId: string): Promise<EntrepriseEntity> {
    const entreprise = new EntrepriseEntity();
    entreprise.lastDataSource = 'https://www.societe.com/societe/';

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    );
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(`${this._urlIdentity}${entrepriseId}.html`);

    if ((await page.$('td ::-p-text(Noms commerciaux)')) === null) {
      entreprise.name = '?';
    } else {
      const nomCommercial = await page.waitForSelector(
        'td ::-p-text(Noms commerciaux)',
      );
      entreprise.name = await page.evaluate(
        (el) => el.nextElementSibling.textContent,
        nomCommercial,
      );
    }

    if ((await page.$('#siren_number > span')) === null) {
      entreprise.siren = '?';
    } else {
      const siren = await page.waitForSelector('#siren_number > span');
      entreprise.siren = await page.evaluate((el) => el.textContent, siren);
    }

    if ((await page.$('#siret_number > span')) === null) {
      entreprise.siret = '?';
    } else {
      const siret = await page.waitForSelector('#siret_number > span');
      entreprise.siret = await page.evaluate((el) => el.textContent, siret);
    }

    if ((await page.$('td ::-p-text(Date création entreprise)')) === null) {
      entreprise.dateCreation = '?';
      entreprise.yearsInExistence = -1;
    } else {
      const dateCreation = await page.waitForSelector(
        'td ::-p-text(Date création entreprise)',
      );
      entreprise.dateCreation = await page.evaluate(
        (el) =>
          el.nextElementSibling.firstElementChild.firstElementChild.textContent,
        dateCreation,
      );
      entreprise.dateCreation = entreprise.dateCreation.replace(/\s/g, '');
      entreprise.dateCreation = entreprise.dateCreation
        .split('-')
        .reverse()
        .join('-');
      entreprise.yearsInExistence =
        new Date().getFullYear() -
        new Date(entreprise.dateCreation).getFullYear();
    }

    if ((await page.$('#trancheeff-histo-description')) === null) {
      entreprise.effective = '?';
    } else {
      const effective = await page.waitForSelector(
        '#trancheeff-histo-description',
      );
      entreprise.effective = await page.evaluate(
        (el) => el.textContent,
        effective,
      );
    }

    if (
      (await page.$('#trancheeff-histo-content .FicheDonnees__date')) === null
    ) {
      entreprise.dateConfirmationEffectif = '?';
    } else {
      const dateConfirmationEffectif = await page.waitForSelector(
        '#trancheeff-histo-content .FicheDonnees__date',
      );
      entreprise.dateConfirmationEffectif = await page.evaluate(
        (el) => el.firstElementChild.textContent,
        dateConfirmationEffectif,
      );
      entreprise.dateConfirmationEffectif = entreprise.dateConfirmationEffectif
        .split(' ')
        .slice(1)
        .join(' ');
      entreprise.dateConfirmationEffectif = entreprise.dateConfirmationEffectif
        .split('-')
        .reverse()
        .join('-');
    }

    entreprise.location = new LocationEntrepriseEntity();
    if ((await page.$('#rensjurcomplete')) != null) {
      const location = await page.waitForSelector('#rensjurcomplete');
      const trs = await location.$$('tr');
      for (const tr of trs) {
        const tds = await tr.$$('td');
        const firstTd = tds[0];
        const text = await page.evaluate((el) => el.textContent, firstTd);
        if (text.includes('Adresse')) {
          const secondTd = tds[1];
          entreprise.location.streetAddress = await page.evaluate(
            (el) => el.textContent,
            secondTd,
          );
        }
        if (text.includes('Code postal')) {
          const secondTd = tds[1];
          entreprise.location.postalCode = await page.evaluate(
            (el) => el.textContent,
            secondTd,
          );
        }
        if (text.includes('Ville')) {
          const secondTd = tds[1];
          entreprise.location.city = await page.evaluate(
            (el) => el.textContent,
            secondTd,
          );
        }
        if (text.includes('Pays')) {
          const secondTd = tds[1];
          entreprise.location.country = await page.evaluate(
            (el) => el.textContent,
            secondTd,
          );
        }
      }
    }

    const representatives = await this.fetchRepresentatives(entrepriseId);
    entreprise.representatives = representatives;

    const finances = await this.fetchFinances(entrepriseId, page);
    entreprise.financeDetails = finances;

    return entreprise;
  }

  async fetchFinances(entrepriseId: string, page: puppeteer.Page) {
    const finances: FinanceEntrepriseEntity[] = [];
    const aTags = await page.$$('a[href*="/classement/"]');
    if (aTags.length > 0) {
      const aTag = aTags[0];
      const linkToStats = await page.evaluate(
        (el) => el.getAttribute('href'),
        aTag,
      );
      await page.goto(`https://www.societe.com${linkToStats}`);
      const select = await page.waitForSelector('.soCard__select');
      const options = await select.$$('option');
      const values = [];
      for (const option of options) {
        const value = await page.evaluate((el) => el.value, option);
        values.push(value);
      }
      for (const value of values) {
        await page.evaluate(`refresh_data(${value});`);
        const caTotal = await page.waitForSelector('#CA-total');
        const caTotalText = await page.evaluate(
          (el) => el.textContent,
          caTotal,
        );
        const finance = new FinanceEntrepriseEntity();
        finance.turnover = caTotalText;
        finance.financialYear = value;
        const capitalSocial = await page.waitForSelector(
          'h3 ::-p-text(Capital social : )',
        );
        const capitalSocialSpan = await capitalSocial.$$('span');
        const secondSpan = capitalSocialSpan[1];
        const capitalSocialText = await page.evaluate(
          (el) => el.textContent,
          secondSpan,
        );
        /*
          Paul le shareCapital il est plus dans l'entitée finance.
          il est devenu un champ dans l'entité entreprise.
        */
        //finance.shareCapital = capitalSocialText.replace(/\s/g, '');

        finances.push(finance);
      }
    }
    return finances;
  }

  async fetchRepresentatives(
    entrepriseId: string,
  ): Promise<EntrepriseRepresentativeEntity[]> {
    const representatives: EntrepriseRepresentativeEntity[] = [];

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    );
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(`${this._urlRepresentatives}${entrepriseId}.html`);

    if ((await page.$('#dirigeant')) === null) {
      return [];
    } else {
      const dirigeants = await page.waitForSelector('#dirigeant');
      const tables = await dirigeants.$$('.table');
      if (tables.length === 0) {
        return [];
      }
      const tablesDirigeants = [];
      for (const table of tables) {
        const text = await page.evaluate((el) => el.textContent, table);
        if (!text.includes('passé') || !text.includes('dirigeant')) {
          tablesDirigeants.push(table);
        }
      }
      for (const table of tablesDirigeants) {
        if ((await table.$('h4')) === null) {
          continue;
        } else {
          const h4 = await table.$('h4');
          const position = await page.evaluate((el) => el.textContent, h4);
          const trs = await table.$$('tr');
          for (const tr of trs) {
            const representative = new EntrepriseRepresentativeEntity();
            representative.age = -1;
            representative.position = position;

            const tds = await tr.$$('td');
            const firstTd = tds[0];
            const spans = await firstTd.$$('span');
            const firstSpan = spans[1];
            const name = await page.evaluate((el) => el.textContent, firstSpan);
            const nameArray = name.split(' ');
            representative.firstName = nameArray[1];
            representative.lastName = nameArray[2];
            const secondSpan = spans[3];
            representative.employmentStartDate = await page.evaluate(
              (el) => el.textContent,
              secondSpan,
            );
            representative.employmentStartDate =
              representative.employmentStartDate.split('-').reverse().join('-');

            representatives.push(representative);
          }
        }
      }
    }

    return representatives;
  }
}
