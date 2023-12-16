import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeppersService } from './scraping/peppers/peppers.service';
import { CsvfileGeneratorService } from './service/csvfile-generator/csvfile-generator.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PeppersService, CsvfileGeneratorService],
})
export class AppModule {}
