import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PappersService } from './scraping/entreprise/pappers.service';
import { data } from 'cheerio/lib/api/attributes';
import { SocieteService } from './scraping/entreprise/societe.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private _pappersService: PappersService,
    private _societeService: SocieteService,
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
}
