import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { EntrepriseEntity } from 'src/entreprise/entities/entreprise.entity';
import { CsvfileGeneratorService } from 'src/service/csvfile-generator/csvfile-generator.service';


@Injectable()
export class PeppersService {
    private _entreprisesData: string[] = [
        'sarl-favata-338411101',
        'bati-france-57-851900654',
        'lenninger-arthur-918347071',
    ];
    private _UrlPappers = "https://www.pappers.fr/entreprise";

    constructor(private _csv : CsvfileGeneratorService){

    }


    async getEntrepriseInformation() {
        
        const browser = await puppeteer.launch({ headless: false }); // Change to 'true' for headless mode
        const page = await browser.newPage();
        const entrepriseDataItem = this._entreprisesData[0];
        try {
            await page.goto(`${this._UrlPappers}/${entrepriseDataItem}`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('div#resume .table-container table tr:nth-child(4) td');
            const pageContent = await page.content();
            const $ = cheerio.load(pageContent);
    
            //identity information 
            const siretRow = $('div div table tr:contains("SIRET (siège)")');
            const siret = siretRow.find('td').text().trim();
            
            const sirenRow = $('div div table tr:contains("SIREN")');
            const siren = sirenRow.find('td').text().trim();

            const entrepriseName = $('h1.big-text').text().trim();
            
            const creationDate = $('div#resume .table-container table tr:nth-child(4) td').text().trim();
            const yearsSinceCreation = this.computeYearsSinceCreation(creationDate);

            const effectiveInfo = $('div#resume .table-container table tr:contains("Effectif") td').text().trim();
            const result = this.extractEffectifAndConfirmatioDate(effectiveInfo);
            const effective = result[1];
            const dateConfirmationEffectif = result[2];

            //dirigeant infomation
            const dirigeantElement = $('section#dirigeants .dirigeant');
            const nameInfo = dirigeantElement.find('.nom a').text().trim();
            const position = dirigeantElement.find('.qualite').text().trim();
            const age = dirigeantElement.find('.age-siren span').text().trim();
            const [firstName, ...lastNameArray] = nameInfo.split(' ');
            const lastName = lastNameArray.join(' '); // Convert to lowercase
    
            //Create the Entity
            const entreprise : EntrepriseEntity =
            {
                id : '12',
                siren: siren,
                siret: siret,
                name : entrepriseName,
                dateCreation: creationDate,
                yearsInExistence : yearsSinceCreation,
                effective: effective,   
                dateConfirmationEffectif: dateConfirmationEffectif,   
                representatives : [
                    {
                        firstName: firstName,
                        lastName: lastName,
                        position: position,
                        age: parseInt(age),
                    }
                ]
            }
            console.log(this._csv.generateCsv([entreprise]).subscribe((data) =>{console.log(data)}));
        } catch (error) {
            console.error('Error during scraping:', error);
        } finally {
            await browser.close();
        }
        
    }

    private computeYearsSinceCreation(creationDate :string){
        const creationDateTime = new Date(creationDate);
        const currentDate = new Date();
        const yearsSinceCreation = currentDate.getFullYear() - creationDateTime.getFullYear();
        return yearsSinceCreation;
    }

    private extractEffectifAndConfirmatioDate(data :string) {
        const regexPattern = /^(.*?) \((.*?)\)$/;
        return data.match(regexPattern);
    }

}