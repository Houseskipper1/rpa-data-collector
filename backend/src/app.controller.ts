import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PeppersService } from './scraping/peppers/peppers.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private pappers : PeppersService) {}

  @Get()
  getHello(): string {
    this.pappers.getEntrepriseInformation()
    return this.appService.getHello();
  }
}
