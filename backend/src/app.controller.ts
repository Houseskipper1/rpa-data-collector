import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PeppersService } from './scraping/peppers/peppers.service';
import { data } from 'cheerio/lib/api/attributes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private _pappersService : PeppersService) {}

  @Get()
  getHello(): string {

    /*
      Test the pappers scraping
      this._pappersService.scrap("bati-france-57-851900654")
      .then((data)=>{
        console.log(data)
      })
    */
   
    return this.appService.getHello();
  }
}
