import { Controller, Get, Header, Param, Query, Res, Put, Body, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { PappersService } from './scraping/entreprise/pappers.service';
import { data } from 'cheerio/lib/api/attributes';
import { SocieteService } from './scraping/entreprise/societe.service';
import { EntrepriseService } from './entreprise/service/entreprise.service';
import { Readable } from 'stream';
import { EntreprisesIdsDto } from './entreprise/dto/entreprisesids.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private _pappersService: PappersService,
    private readonly entrepriseService: EntrepriseService,
    private _societeService: SocieteService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // get societe
  @Put('societe')
  async getSociete(
    @Body() entreprisesIdsDto: EntreprisesIdsDto,
    @Res() res: Response,
  ) {
    const entreprises = await this._societeService.fetch(entreprisesIdsDto);
    for (const entreprise of entreprises) {
      this.entrepriseService.create(entreprise);
    }
    res.status(HttpStatus.OK).json(entreprises);
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
