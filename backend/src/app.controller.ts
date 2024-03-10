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
import e, { Response } from 'express';
import { SireneEntrepriseService } from './sirene-entreprise/services/sirene-entreprise.service';
import { ParameterService } from './parameter/service/parameter.service';
import { ParameterEntity } from './parameter/entity/parameter.entity';
import { ApiTags } from '@nestjs/swagger';
import { EntrepriseEntity } from './entreprise/entities/entreprise.entity';
import { SireneEntrepriseEntity } from './sirene-entreprise/entities/sirene-entreprise.entity';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(
    private _pappersService: PappersService,
    private readonly entrepriseService: EntrepriseService,
    private _sireneService: SireneService,
    private readonly banService: BanService,
    private readonly _sirenEntrepriseService: SireneEntrepriseService,
    private readonly _parameterService: ParameterService,
  ) {
    this._sireneService.populateSireneEntreprise().then((populated) => {
      if (populated) {
        // Création du paramètre pour sireneEntreprise (1 mois de refresh Frequency)
        let parameterEntity: ParameterEntity = {
          id: '',
          parameterName: 'sireneEntrepriseParam',
          refreshFrequency: 30 * 24 * 60 * 60 * 10000,
          lastUpdate: new Date(),
        };
        let scrapingRefreshParam: ParameterEntity = {
          id: '',
          parameterName: 'scrapingRefreshParam',
          refreshFrequency: 30 * 24 * 60 * 60 * 10000,
          lastUpdate: new Date(),
        };
        this._parameterService.create(parameterEntity);
        this._parameterService.create(scrapingRefreshParam);
      }
    });
  }

  @Put('scraping/societe')
  async getSociete(
    @Body() entreprisesIdsDto: EntreprisesIdsDto,
    @Res() res: Response,
  ) {}

  /**
   * 
   * @param scrapSirenesDto list of sirets
   * @returns {Promise<Promise<EntrepriseEntity>[]>} list of Entreprises Entities
   */
  @Put('scraping/sirene')
  async scrapSirenes(@Body() scrapSirenesDto: ScrapSirenesDto): Promise<Promise<EntrepriseEntity>[]> {
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
    @Query('forceScraping') forceScraping: number,
  ): Promise<void> {
    const entreprise = await this.entrepriseService.findBySiren(siren);

    if (forceScraping == 1) {
      await this._pappersService.scrap(siren);
      return;
    }

    if (entreprise == undefined) {
      await this._pappersService.scrap(siren);
      return;
    }

    const data = await this._parameterService.findByParameterName(
      'scrapingRefreshParam',
    );
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

  /**
   * 
   * @param address string of an address
   * @param range range around the address
   * @returns {Promise<SireneEntrepriseEntity[]>} all SireneEntreprise inside the range of the given address
   */
  @Get('/search')
  async searchInRadius(
    @Query('address') address: string,
    @Query('range') range: number,
  ): Promise<SireneEntrepriseEntity[]> {
    let pos = await this.banService.findByAddress(address);
    let res = this.banService.getInRadius(pos, range);
    return res;
  }

  /**
   * 
   * @returns {Promise<SireneEntrepriseEntity[]>} list of limited SireneEntreprises
   */
  @Get('/sireneEntreprises')
  async getSireneEntreprises(): Promise<SireneEntrepriseEntity[]> {
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
