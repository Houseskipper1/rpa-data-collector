import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpStatus,
  Param,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { PappersService } from './scraping/entreprise/pappers.service';
import { SocieteService } from './scraping/entreprise/societe.service';
import { EntrepriseService } from './entreprise/service/entreprise.service';
import { Readable } from 'stream';
import { SireneService } from './api/sirene/sirene.service';
import { ScrapSirenesDto } from './api/sirene/scrap-sirene.dto';
import { BanService } from './api/ban/ban.service';
import { EntreprisesIdsDto } from './entreprise/dto/entreprisesids.dto';
import { Response } from 'express';
import { SireneEntrepriseService } from './sirene-entreprise/services/sirene-entreprise.service';
import { Console } from 'console';

@Controller()
export class AppController {
  constructor(
    private _pappersService: PappersService,
    private readonly entrepriseService: EntrepriseService,
    private _societeService: SocieteService,
    private _sireneService: SireneService,
    private readonly banService: BanService,
    private readonly _sirenEntrepriseService: SireneEntrepriseService,
  ) {
    this._sireneService.populateSireneEntreprise();
  }

  @Put('scraping/societe')
  async getSociete(
    @Body() entreprisesIdsDto: EntreprisesIdsDto,
    @Res() res: Response,
  ) {}

  @Put('scraping/sirene')
  async scrapSirenes(@Body() scrapSirenesDto: ScrapSirenesDto) {
    return this._sireneService.getEntreprisesAPI(scrapSirenesDto.entreprises);
  }

  @Put('scraping/pappers')
  async scrappingPappers(@Body() data: any): Promise<void> {
    const entreprise = await this.entrepriseService.findBySiren(data.ids);

    if (entreprise == undefined) {
      await this._pappersService.scrap(data.ids);
    }

 
  
  }

  @Put('scraping/pappers/:siren')
  async scrappingOneWithPappers(@Param('siren') siren: string): Promise<void> {
    const entreprise = await this.entrepriseService.findBySiren(siren);
    if (entreprise == undefined) {
      await this._pappersService.scrap(siren);
      return;
    }
    const updateTimestamp = entreprise.updated.getTime(); 
    const currentTimestamp = new Date().getTime(); 
    const diffInMilliseconds = currentTimestamp - updateTimestamp;

    if (diffInMilliseconds > 2 * 60 * 1000) { // 2 minutes en millisecondes  
      await this._pappersService.scrap(siren); // rescrapp 
    }
    
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

  @Get('/search')
  async searchInRadius(@Query() query: any) {
    let lat = query.lat;
    let lon = query.lon;
    let radius = query.radius;
    return this.banService.getInRadius({ lat, long: lon }, radius);
  }

  @Get('/sireneEntreprises')
  async getSireneEntreprises() {
    return this._sirenEntrepriseService.findAll();
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
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${finalFilename}`,
      );
      const textStream = new Readable();
      textStream.push(jsonData);
      textStream.push(null);
      textStream.pipe(res);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  @Delete('CleanBDD')
  @Header('Content-Type', 'text/plain')
  async deleteBDD() {
    return this.entrepriseService.deleteAll();
  }
}
