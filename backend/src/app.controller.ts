import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { PappersService } from './scraping/entreprise/pappers.service';
import { EntrepriseService } from './entreprise/service/entreprise.service';
import { Readable } from 'stream';
import { SireneService } from './api/sirene/sirene.service';
import { ScrapSirenesDto } from './api/sirene/scrap-sirene.dto';
import { BanService } from './api/ban/ban.service';
import { EntreprisesIdsDto } from './entreprise/dto/entreprisesids.dto';
import { Response } from 'express';
import { SireneEntrepriseService } from './sirene-entreprise/services/sirene-entreprise.service';
import { ParameterService } from './parameter/service/parameter.service';

@Controller()
export class AppController {
  constructor(
    private _pappersService: PappersService,
    private readonly entrepriseService: EntrepriseService,
    private _sireneService: SireneService,
    private readonly banService: BanService,
    private readonly _sirenEntrepriseService: SireneEntrepriseService,
    private readonly _parameterService : ParameterService
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
  async scrappingOneWithPappers(
    @Param('siren') siren: string,
    @Query('forceScraping') forceScraping: boolean): Promise<void> {
    
    const entreprise = await this.entrepriseService.findBySiren(siren);
    if (entreprise == undefined || forceScraping) {
      await this._pappersService.scrap(siren);
      return;
    }
    const data = await this._parameterService.findByParameterName("scrappingParamRefresh");   
    const updateTimestamp = entreprise.updated.getTime(); 
    const currentTimestamp = new Date().getTime(); 
    const diffInMilliseconds = currentTimestamp - updateTimestamp;
    if (diffInMilliseconds > data.refreshFrequency) {  
      await this._pappersService.scrap(siren); // rescrap if the refresh frequency is passed
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
  async searchInRadius(@Query("address") address: String, @Query("range") range: number) {
    let pos = await this.banService.findByAddress(address);
    let res = this.banService.getInRadius(pos, range);
    return res;
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
