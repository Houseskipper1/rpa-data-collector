import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { EntrepriseEntity } from 'src/entreprise/entities/entreprise.entity';
import { EntrepriseRepresentativeEntity } from 'src/entreprise/entities/entreprise.representative.entity';
import { LocationEntrepriseEntity } from 'src/entreprise/entities/entreprise.location.entity';
import { BanService } from 'src/api/ban/ban.service';
import { FinanceEntrepriseEntity } from 'src/entreprise/entities/entreprise.Finance.entity';
import { EntrepriseService } from 'src/entreprise/service/entreprise.service';

@Injectable()
export class PappersService {
  private _UrlPappers = 'https://www.pappers.fr/entreprise';

  private _browser;
  constructor(
    private entrepriseService: EntrepriseService,
    private _banService: BanService,
  ) {
    puppeteer.launch({ headless: false }).then(browser => {
      this._browser = browser;
    });
  }

  async scrap(siren: string): Promise<EntrepriseEntity> {
      const page = await this._browser.newPage();
      try {
        await page.goto(`${this._UrlPappers}/${siren}`, {
          waitUntil: 'domcontentloaded',
        });
        await page.waitForSelector(
          'div#resume .table-container table tr:nth-child(4) td',
        );
        const pageContent = await page.content();
        const $ = cheerio.load(pageContent);
        let entreprise: EntrepriseEntity = new EntrepriseEntity();
        entreprise.lastDataSources = 'https://www.pappers.fr/entreprise';
        let representative: EntrepriseRepresentativeEntity =
          new EntrepriseRepresentativeEntity();

        const capitalSocialRow = $(
          'div.content table tr:contains("Capital social")',
        );
        entreprise.shareCapital = capitalSocialRow.find('td').text().trim();

        const siretRow = $('div div table tr:contains("SIRET (siège)")');
        entreprise.siret = siretRow.find('td').text().trim();

        const sirenRow = $('div div table tr:contains("SIREN")');
        entreprise.siren = sirenRow.find('td').text().trim();
        entreprise.name = $('h1.big-text').text().trim();

        entreprise.dateCreation = $(
          'div#resume .table-container table tr:nth-child(4) td',
        )
          .text()
          .trim();
        entreprise.yearsInExistence = this.computeYearsSinceCreation(
          entreprise.dateCreation,
        );

        const effectiveInfo = $(
          'div#resume .table-container table tr:contains("Effectif") td',
        )
          .text()
          .trim();
        const { salarieRange, year } =
          this.extractDataFromString(effectiveInfo);
        entreprise.effective = salarieRange;
        entreprise.dateConfirmationEffectif = year;

        const adresseElement = $(
          'div.entreprise-page .table-container table tr th:contains("Adresse") + td',
        );

        const adresseEntreprise = adresseElement.text().trim();
        let location = {} as LocationEntrepriseEntity;

        try {
          const result =
            await this._banService.findCompletedLocationByAddress(
              adresseEntreprise,
            );
          location = result;
        } catch (error) {
          console.error(
            "Une erreur s'est produite lors de la recherche de l'adresse.",
            error,
          );
        }
        entreprise.location = location;

        //Representative
        entreprise.representatives = [];

        // Extract information of the leader
        const firstLeaderElement = $('section#dirigeants .dirigeant').first();
        const leaderName = firstLeaderElement.find('.nom a').text().trim();
        const { firstName, lastName } =
          this.separateLastNameFirstName(leaderName);
        representative.firstName = firstName;
        representative.lastName = lastName;
        representative.position = firstLeaderElement
          .find('.qualite')
          .text()
          .trim();
        const age = parseInt(
          firstLeaderElement.find('.age-siren span').eq(0).text().trim(),
        );
        representative.age = isNaN(age) ? 0 : age;
        representative.employmentStartDate = firstLeaderElement
          .find('.age-siren span.age-siren')
          .text()
          .trim();

        entreprise.representatives = [
          ...entreprise.representatives,
          representative,
        ];

        // Find the section with finances data
        const financeEntities = await this.buildFinanceEntity(page);
        entreprise.financeDetails = financeEntities;
        const savedEntity =
          await this.entrepriseService.createOrUpdateBySirene(entreprise);
        console.log('Entity saved:', savedEntity);
      } catch (error) {
        console.error('Error during scraping:', error);
        return Promise.reject(error);
      }
      await page.close()
    //await browser.close();
  }

  private computeYearsSinceCreation(creationDate: string) {
    const dateParts = creationDate.split('/');
    const creationDateTime = new Date(
      parseInt(dateParts[2], 10),
      parseInt(dateParts[1], 10) - 1,
      parseInt(dateParts[0], 10),
    );
    const currentDate = new Date();
    const yearsSinceCreation =
      currentDate.getFullYear() - creationDateTime.getFullYear();
    return yearsSinceCreation;
  }

  private extractDataFromString(str: string): {
    salarieRange: string;
    year: string;
  } {
    const salarieIndex = str.indexOf('salarié');
    const salarieRange =
      salarieIndex !== -1 ? str.slice(0, salarieIndex + 8).trim() : '';
    const yearStartIndex = str.indexOf('donnée') + 6;
    const yearEndIndex = str.indexOf(')', yearStartIndex);
    const year =
      yearStartIndex !== -1
        ? str.slice(yearStartIndex, yearEndIndex).trim()
        : '';
    return { salarieRange, year };
  }

  private separateLastNameFirstName(fullName: string): {
    lastName: string;
    firstName: string;
  } {
    const nameParts = fullName.split(' ');
    const lastNameIndex = nameParts.findIndex(
      (part) => part === part.toUpperCase(),
    );
    if (lastNameIndex !== -1) {
      const lastName = nameParts.slice(lastNameIndex).join(' ');
      const firstName = nameParts.slice(0, lastNameIndex).join(' ');
      return { firstName, lastName };
    } else {
      return { firstName: fullName, lastName: fullName };
    }
  }

  private async buildFinanceEntity(page): Promise<FinanceEntrepriseEntity[]> {
    let financeEntities: FinanceEntrepriseEntity[] = [];

    const { years, performanceData } = await this.scrapePerformanceData(page);
    if (years == undefined) {
      return financeEntities;
    }

    const nbYears = years.length;
    for (let i = 0; i < nbYears; i++) {
      let financeEntity = {
        financialYear: years[i],
        turnover: performanceData["Chiffre d'affaires (€)"][i],
        turnoverTrend: '/',
        cashFlow: performanceData['Trésorerie (€)'][i],
        netProfit: performanceData['Résultat net (€)'][i],
        netMargin: performanceData['Marge nette (%)'][i],
      } as FinanceEntrepriseEntity;
      financeEntities.push(financeEntity);
    }
    return financeEntities;
  }

  async scrapePerformanceData(page) {
    const financesSection = await page.$('#finances');
    if (financesSection) {
      let years;
      if (financesSection) {
        years = await financesSection.$$eval(
          '.tr-header th:not(:first-child)',
          (headers) =>
            Array.from(
              new Set(headers.map((header) => header.textContent.trim())),
            ),
        );
      }
      const ratiosTable = await financesSection.$('.ratios table');
      if (ratiosTable) {
        const performanceData = await page.evaluate(() => {
          const data = {};
          const rows = document.querySelectorAll(
            '.ratios table tr:not(:first-child)',
          );
          rows.forEach((row) => {
            const performanceLabel = row
              .querySelector('th:first-child')
              .textContent.trim();
            const values = Array.from(row.querySelectorAll('td')).map((cell) =>
              cell.textContent.trim(),
            );
            data[performanceLabel] = values;
          });
          return data;
        });
        return {
          years: years,
          performanceData: performanceData,
        };
      } else {
        console.log('Tableau de ratios non trouvé');
      }
    } else {
      console.log('Section des finances non trouvée');
    }
    return {}; // Retourner un objet vide si les données ne sont pas trouvées
  }
}
