import { Controller, Get, Header, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PappersService } from './scraping/entreprise/pappers.service';
import { data } from 'cheerio/lib/api/attributes';
import { SocieteService } from './scraping/entreprise/societe.service';
import { EntrepriseService } from './entreprise/service/entreprise.service';
import { Readable } from 'stream';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private _pappersService: PappersService,
    private readonly entrepriseService: EntrepriseService,
    private _societeService: SocieteService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // get societe 
  @Get('societe')
  getSociete(): any {
    return this._societeService.fetch();
  }
    
  @Get('CSVExport')
  @Header('Content-Type', 'text/plain')
  @Header('Content-Disposition', 'attachment; filename=entrepriseData.csv')
  async getFile(@Res() res) {
    try {
      const csvData = await this.entrepriseService.exportToCSV();
      const textStream = new Readable();
      textStream.push(csvData);
      textStream.push(null);
      textStream.pipe(res);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }
}
