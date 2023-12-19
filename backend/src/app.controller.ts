import { Controller, Get, Header, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { EntrepriseService } from './entreprise/service/entreprise.service';
import { Readable } from 'stream';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly entrepriseService : EntrepriseService) {
              }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('CSVExport')
  @Header('Content-Type','text/plain')
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
