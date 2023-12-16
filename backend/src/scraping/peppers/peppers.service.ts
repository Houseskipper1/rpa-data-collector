import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { EntrepriseEntity } from 'src/entreprise/entities/entreprise.entity';
import { EntrepriseRepresentativeEntity } from 'src/entreprise/entities/entreprise.representative.entity';


@Injectable()
export class PeppersService {
    private _entreprisesData: string[] = [
        'sarl-favata-338411101',
        'bati-france-57-851900654',
        'lenninger-arthur-918347071',
    ];
    private _UrlPappers = "https://www.pappers.fr/entreprise";

    constructor(){

    }

    async scrap(idEntreprise:string ) :  Promise<EntrepriseEntity>  {
        
        const browser = await puppeteer.launch({ headless: false }); 
        const page = await browser.newPage();
        try {
            await page.goto(`${this._UrlPappers}/${idEntreprise}`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('div#resume .table-container table tr:nth-child(4) td');
            const pageContent = await page.content();
            const $ = cheerio.load(pageContent);
            let entreprise :EntrepriseEntity = new EntrepriseEntity();
            let representative  :EntrepriseRepresentativeEntity = new EntrepriseRepresentativeEntity();
            
            //identity information 
            const siretRow = $('div div table tr:contains("SIRET (siège)")');
            entreprise.siret = siretRow.find('td').text().trim();
            
            const sirenRow = $('div div table tr:contains("SIREN")');
            entreprise.siren = sirenRow.find('td').text().trim();
            entreprise.name = $('h1.big-text').text().trim();
            
            entreprise.dateCreation = $('div#resume .table-container table tr:nth-child(4) td').text().trim();
            entreprise.yearsInExistence = this.computeYearsSinceCreation(entreprise.dateCreation);

            const effectiveInfo = $('div#resume .table-container table tr:contains("Effectif") td').text().trim();
            const { salarieRange, year } = this.extractDataFromString(effectiveInfo);
            entreprise.effective = salarieRange;
            entreprise.dateConfirmationEffectif = year;

            entreprise.representatives = [];
        
            const dirigeantElement = $('section#dirigeants .dirigeant');
            const {firstName,lastName}  = this.separateLastNameFirstName(dirigeantElement.find('.nom a').text().trim())
            representative.firstName =firstName;
            representative.lastName =lastName;            
            representative.position = dirigeantElement.find('.qualite').text().trim();;
            representative.age = parseInt(dirigeantElement.find('.age-siren span').text().trim());
            entreprise.representatives = [...entreprise.representatives,representative];
            
            return Promise.resolve(entreprise);
        } catch (error) {
            console.error('Error during scraping:', error);
            return Promise.reject(error);
        } finally {
            await browser.close();
        }
    }



    private computeYearsSinceCreation(creationDate :string) {
        const dateParts = creationDate.split('/');
        const creationDateTime = new Date(parseInt(dateParts[2], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[0], 10));
        const currentDate = new Date();
        const yearsSinceCreation = currentDate.getFullYear() - creationDateTime.getFullYear();
        return yearsSinceCreation;
    }

    private extractDataFromString(str: string): { salarieRange: string, year: string } {
        const salarieIndex = str.indexOf('salarié');
        const salarieRange = salarieIndex !== -1 ? str.slice(0, salarieIndex + 8).trim() : '';
        const yearStartIndex = str.indexOf('donnée') + 6;
        const yearEndIndex = str.indexOf(')', yearStartIndex);
        const year = yearStartIndex !== -1 ? str.slice(yearStartIndex, yearEndIndex).trim() : '';
        return { salarieRange, year };
    }

    private separateLastNameFirstName(fullName: string): { lastName: string, firstName: string } {
        const nameParts = fullName.split(' ');
        const lastNameIndex = nameParts.findIndex(part => part === part.toUpperCase());
        if (lastNameIndex !== -1) {
          const lastName = nameParts.slice(lastNameIndex).join(' ');
          const firstName = nameParts.slice(0, lastNameIndex).join(' ');
          return {firstName,lastName};
        } else {
          throw new Error('Last name not found in the provided full name.');
        }
    }
      
}