import { Body, Controller, Get, Header, Post, Put, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PappersService } from './scraping/entreprise/pappers.service';
import { data } from 'cheerio/lib/api/attributes';
import { SocieteService } from './scraping/entreprise/societe.service';
import { EntrepriseService } from './entreprise/service/entreprise.service';
import { Readable } from 'stream';
import { SireneService } from './api/sirene/sirene.service';
import { EntrepriseEntity } from './entreprise/entities/entreprise.entity';
import { ScrapSirenesDto } from './api/sirene/scrap-sirene.dto';
import { BanService } from './api/ban/ban.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private _pappersService: PappersService,
    private readonly entrepriseService: EntrepriseService,
    private _societeService: SocieteService,
    private _sireneService: SireneService,
    private readonly banService: BanService,
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

  @Put('sirene')
  async scrapSirenes(@Body() scrapSirenesDto: ScrapSirenesDto){
      return this._sireneService.getEntreprisesAPI(scrapSirenesDto.entreprises);
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

  @Get("/search")
  async searchInRadius(@Query() query: any) {
    let lat = query.lat;
    let lon = query.lon;
    let radius = query.radius;
    return this.banService.getInRadius({lat, long: lon}, radius);
  }

  @Get('jsonExport')
  @Header('Content-Type', 'text/plain')
  async getFileJson(@Query('filename') filename: string, @Res() res) {
    try {
      const jsonData = await this.entrepriseService.exportToJSON();
      let finalFilename = filename || 'jpa-data-collector.json';
      if (!finalFilename.toLowerCase().endsWith('.json')) {
        finalFilename += '.json';
      }
      res.setHeader('Content-Disposition', `attachment; filename=${finalFilename}`);
      const textStream = new Readable();
      textStream.push(jsonData);
      textStream.push(null);
      textStream.pipe(res);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }

  }
}
